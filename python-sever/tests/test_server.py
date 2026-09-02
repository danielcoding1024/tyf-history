import importlib.util
import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch


SERVER_PATH = Path(__file__).resolve().parents[1] / "server.py"


def load_server_module():
    if not SERVER_PATH.is_file():
        raise AssertionError("缺少可部署的 python-sever/server.py")

    module_name = "tyf_server_under_test"
    sys.modules.pop(module_name, None)
    spec = importlib.util.spec_from_file_location(module_name, SERVER_PATH)
    if spec is None or spec.loader is None:
        raise AssertionError("无法加载 python-sever/server.py")

    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


class FakeDashScopeResponse:
    def __init__(self, body, status_code=200, content_type="text/event-stream"):
        self.body = body
        self.status_code = status_code
        self.headers = {"content-type": content_type}
        self.text = body
        self.content = body.encode("utf-8")
        self.closed = False

    def iter_lines(self, decode_unicode=False):
        for line in self.body.splitlines():
            yield line if decode_unicode else line.encode("utf-8")

    def close(self):
        self.closed = True


class DashScopeProxyTests(unittest.TestCase):
    def test_chat_forwards_responses_payload_and_filters_reasoning(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            "event: response.reasoning_text.delta\n"
            'data: {"type":"response.reasoning_text.delta","delta":"hidden"}\n\n'
            "event: response.output_text.delta\n"
            'data: {"type":"response.output_text.delta","delta":"通远"}\n\n'
            "event: response.output_text.delta\n"
            'data: {"type":"response.output_text.delta","delta":"坊"}\n\n'
            "event: response.completed\n"
            'data: {"type":"response.completed"}\n\n'
        )
        captured = {}

        def fake_post(url, **kwargs):
            captured["url"] = url
            captured.update(kwargs)
            return upstream

        request_body = {
            "input": [{"role": "user", "content": "通远坊是什么？"}],
            "stream": True,
        }

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", side_effect=fake_post):
                response = TestClient(server.app).post("/api/chat", json=request_body)

        self.assertEqual(response.status_code, 200)
        self.assertIn("text/event-stream", response.headers.get("content-type", ""))
        self.assertIn('"delta":"通远"', response.text)
        self.assertIn('"delta":"坊"', response.text)
        self.assertNotIn("hidden", response.text)
        self.assertEqual(captured["json"], request_body)
        self.assertEqual(captured["headers"]["Authorization"], "Bearer unit-test-secret")
        self.assertTrue(captured["url"].endswith("/compatible-mode/v1/responses"))
        self.assertTrue(upstream.closed)

    def test_chat_requires_server_side_api_key(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("DASHSCOPE_API_KEY", None)
            with patch.object(server.requests, "post") as post:
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": True},
                )

        self.assertEqual(response.status_code, 503)
        self.assertIn("DASHSCOPE_API_KEY", response.text)
        post.assert_not_called()

    def test_chat_rejects_non_stream_requests(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            '{"output":[]}',
            status_code=200,
            content_type="application/json",
        )

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream) as post:
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": False},
                )

        self.assertEqual(response.status_code, 422)
        post.assert_not_called()

    def test_upstream_error_redacts_api_key(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            json.dumps({"message": "invalid unit-test-secret"}),
            status_code=401,
            content_type="application/json",
        )

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream):
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": True},
                )

        self.assertEqual(response.status_code, 401)
        self.assertNotIn("unit-test-secret", response.text)
        self.assertIn("[已隐藏]", response.text)
        self.assertTrue(upstream.closed)

    def test_incomplete_response_becomes_error_event(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            "event: response.output_text.delta\n"
            'data: {"type":"response.output_text.delta","delta":"半截"}\n\n'
            "event: response.incomplete\n"
            'data: {"type":"response.incomplete"}\n\n'
        )

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream):
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": True},
                )

        self.assertEqual(response.status_code, 200)
        self.assertIn('event: error', response.text)
        self.assertNotIn('event: response.incomplete', response.text)

    def test_early_eof_after_delta_becomes_error_event(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            "event: response.output_text.delta\n"
            'data: {"type":"response.output_text.delta","delta":"半截"}\n\n'
        )

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream):
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": True},
                )

        self.assertIn('"delta":"半截"', response.text)
        self.assertIn('event: error', response.text)
        self.assertIn('提前中断', response.text)

    def test_completed_event_stops_before_duplicate_done_marker(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        upstream = FakeDashScopeResponse(
            "event: response.output_text.delta\n"
            'data: {"type":"response.output_text.delta","delta":"完整"}\n\n'
            "event: response.completed\n"
            'data: {"type":"response.completed"}\n\n'
            "data: [DONE]\n\n"
        )

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream):
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": [{"role": "user", "content": "test"}], "stream": True},
                )

        self.assertEqual(response.text.count('event: response.completed'), 1)

    def test_chat_rejects_more_than_thirty_messages(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        messages = [{"role": "user", "content": str(index)} for index in range(31)]
        upstream = FakeDashScopeResponse(
            "event: response.completed\n"
            'data: {"type":"response.completed"}\n\n'
        )
        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            with patch.object(server.requests, "post", return_value=upstream) as post:
                response = TestClient(server.app).post(
                    "/api/chat",
                    json={"input": messages, "stream": True},
                )

        self.assertEqual(response.status_code, 422)
        post.assert_not_called()

    def test_healthz_reports_service_ready(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        response = TestClient(server.app).get("/healthz")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["ok"], True)

    def test_readyz_requires_api_key(self):
        server = load_server_module()
        from fastapi.testclient import TestClient

        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("DASHSCOPE_API_KEY", None)
            missing = TestClient(server.app).get("/readyz")

        with patch.dict(os.environ, {"DASHSCOPE_API_KEY": "unit-test-secret"}, clear=False):
            configured = TestClient(server.app).get("/readyz")

        self.assertEqual(missing.status_code, 503)
        self.assertEqual(configured.status_code, 200)
        self.assertEqual(configured.json()["ready"], True)


if __name__ == "__main__":
    unittest.main()
