# -*- coding: utf-8 -*-

"""通远坊网站的阿里云百炼 Responses API 服务端代理。"""

import json
import os
import time
from typing import Any, Dict, Generator, List, Literal, Tuple

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask


DEFAULT_DASHSCOPE_APP_ID = "2617226b74144e26bd2b45038894763c"
DASHSCOPE_URL_TEMPLATE = (
    "https://dashscope.aliyuncs.com/api/v2/apps/agent/"
    "{app_id}/compatible-mode/v1/responses"
)
CONNECT_TIMEOUT_SECONDS = 10
READ_TIMEOUT_SECONDS = 120
MAX_MESSAGES = 30
MAX_TOTAL_CONTENT_CHARS = 60_000
TERMINAL_EVENT_TYPES = {
    "response.completed",
    "response.incomplete",
    "response.failed",
    "error",
}


app = FastAPI(title="TYF DashScope Proxy", version="5.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=20_000)


class ChatReq(BaseModel):
    input: List[ChatMessage]
    # 只允许流式模式，避免完整 Responses 对象中的内部事件被原样暴露。
    stream: Literal[True] = True


@app.get("/healthz")
def healthz() -> Dict[str, Any]:
    return {
        "ok": True,
        "provider": "dashscope",
        "ts": int(time.time()),
    }


@app.get("/readyz")
def readyz() -> Dict[str, Any]:
    if not os.getenv("DASHSCOPE_API_KEY", "").strip():
        raise HTTPException(status_code=503, detail="DASHSCOPE_API_KEY 未配置。")
    return {
        "ready": True,
        "provider": "dashscope",
    }


def _dashscope_url() -> str:
    app_id = os.getenv("DASHSCOPE_APP_ID", DEFAULT_DASHSCOPE_APP_ID).strip()
    if not app_id:
        app_id = DEFAULT_DASHSCOPE_APP_ID
    return DASHSCOPE_URL_TEMPLATE.format(app_id=app_id)


def _redact(message: str, api_key: str) -> str:
    return message.replace(api_key, "[已隐藏]") if api_key else message


def _error_message(value: Any) -> str:
    if not isinstance(value, dict):
        return ""

    message = value.get("message")
    if isinstance(message, str):
        return message

    error = value.get("error")
    if isinstance(error, str):
        return error
    if isinstance(error, dict):
        nested = _error_message(error)
        if nested:
            return nested

    response = value.get("response")
    if isinstance(response, dict):
        return _error_message(response)
    return ""


def _read_upstream_error(response: requests.Response, api_key: str) -> str:
    raw_body = (response.text or "").strip()
    fallback = f"百炼请求失败（HTTP {response.status_code}）。"
    if not raw_body:
        return fallback

    try:
        parsed = json.loads(raw_body)
        message = _error_message(parsed) or fallback
    except (TypeError, ValueError, json.JSONDecodeError):
        message = fallback
    return _redact(message, api_key)


def _iter_sse_events(response: requests.Response) -> Generator[Tuple[str, str], None, None]:
    event_name = ""
    data_lines: List[str] = []

    for raw_line in response.iter_lines(decode_unicode=False):
        if raw_line is None:
            continue
        if isinstance(raw_line, bytes):
            line = raw_line.decode("utf-8", errors="replace")
        else:
            line = str(raw_line)
        line = line.rstrip("\r\n")

        if not line:
            if data_lines:
                yield event_name, "\n".join(data_lines)
            event_name = ""
            data_lines = []
            continue

        if line.startswith("event:"):
            event_name = line[6:].strip()
        elif line.startswith("data:"):
            data_lines.append(line[5:].lstrip())

    if data_lines:
        yield event_name, "\n".join(data_lines)


def _serialize_sse(event_name: str, data: Dict[str, Any]) -> str:
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return f"event: {event_name}\ndata: {payload}\n\n"


def _sse_event_type(event_name: str, data: str) -> str:
    if data == "[DONE]":
        return "response.completed"
    try:
        parsed = json.loads(data)
    except (TypeError, ValueError, json.JSONDecodeError):
        return event_name
    if isinstance(parsed, dict) and isinstance(parsed.get("type"), str):
        return parsed["type"]
    return event_name


def _filter_sse_event(event_name: str, data: str, api_key: str) -> str:
    if not data:
        return ""
    if data == "[DONE]":
        return _serialize_sse("response.completed", {"type": "response.completed"})

    try:
        parsed = json.loads(data)
    except (TypeError, ValueError, json.JSONDecodeError):
        if event_name == "error":
            return _serialize_sse(
                "error",
                {"type": "error", "message": "百炼服务返回了错误事件。"},
            )
        return ""

    if not isinstance(parsed, dict):
        return ""

    event_type = parsed.get("type") if isinstance(parsed.get("type"), str) else event_name
    if event_name and event_type != event_name:
        return ""

    if event_type == "response.output_text.delta" and isinstance(parsed.get("delta"), str):
        return _serialize_sse(event_type, {"type": event_type, "delta": parsed["delta"]})

    if event_type == "response.completed":
        return _serialize_sse(event_type, {"type": event_type})

    if event_type == "response.incomplete":
        return _serialize_sse(
            "error",
            {"type": "error", "message": "百炼服务未能完成回答，请重试。"},
        )

    if event_type in {"error", "response.failed"}:
        message = _redact(_error_message(parsed) or "百炼服务返回了错误事件。", api_key)
        return _serialize_sse("error", {"type": "error", "message": message})

    # reasoning、生命周期和其他内部事件不发送给浏览器。
    return ""


def _stream_filtered_response(
    upstream: requests.Response,
    api_key: str,
) -> Generator[str, None, None]:
    terminal_seen = False
    try:
        for event_name, data in _iter_sse_events(upstream):
            event_type = _sse_event_type(event_name, data)
            filtered = _filter_sse_event(event_name, data, api_key)
            if filtered:
                yield filtered
            if event_type in TERMINAL_EVENT_TYPES:
                terminal_seen = True
                break

        if not terminal_seen:
            yield _serialize_sse(
                "error",
                {"type": "error", "message": "百炼响应提前中断，请重试。"},
            )
    except Exception:
        yield _serialize_sse(
            "error",
            {"type": "error", "message": "读取百炼流式响应失败，请稍后再试。"},
        )
    finally:
        upstream.close()


@app.post("/api/chat")
def api_chat(request: ChatReq):
    api_key = os.getenv("DASHSCOPE_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=503, detail="DASHSCOPE_API_KEY 未配置。")
    if not request.input:
        raise HTTPException(status_code=422, detail="input 至少需要一条消息。")
    if len(request.input) > MAX_MESSAGES:
        raise HTTPException(status_code=422, detail=f"input 最多允许 {MAX_MESSAGES} 条消息。")
    if sum(len(message.content) for message in request.input) > MAX_TOTAL_CONTENT_CHARS:
        raise HTTPException(status_code=422, detail="对话内容总长度超出限制。")

    payload = {
        "input": [
            {"role": message.role, "content": message.content}
            for message in request.input
        ],
        "stream": True,
    }
    headers = {
        "Accept": "text/event-stream",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        upstream = requests.post(
            _dashscope_url(),
            headers=headers,
            json=payload,
            stream=True,
            timeout=(CONNECT_TIMEOUT_SECONDS, READ_TIMEOUT_SECONDS),
        )
    except requests.Timeout as exc:
        raise HTTPException(status_code=504, detail="连接百炼服务超时。") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="连接百炼服务失败。") from exc

    if not 200 <= upstream.status_code < 300:
        status_code = upstream.status_code if 400 <= upstream.status_code < 600 else 502
        message = _read_upstream_error(upstream, api_key)
        upstream.close()
        raise HTTPException(status_code=status_code, detail=message)

    content_type = upstream.headers.get("content-type", "")
    if "text/event-stream" not in content_type.lower():
        upstream.close()
        raise HTTPException(status_code=502, detail="百炼服务未返回流式响应。")
    return StreamingResponse(
        _stream_filtered_response(upstream, api_key),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
        background=BackgroundTask(upstream.close),
    )
