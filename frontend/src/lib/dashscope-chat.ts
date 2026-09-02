export type DashScopeRole = 'user' | 'assistant';

export interface DashScopeMessage {
  role: DashScopeRole;
  content: string;
}

interface DashScopeRequest {
  input: DashScopeMessage[];
  stream: true;
}

type DashScopeResponseData = Record<string, unknown>;

/** 构造 Responses 兼容接口请求，保留用户与助手的完整对话上下文。 */
export function buildDashScopeRequest(messages: readonly DashScopeMessage[]): DashScopeRequest {
  return {
    input: messages.map((message) => ({ ...message })),
    stream: true,
  };
}

/** 返回百炼应用的兼容 Responses API 路径。 */
export function getDashScopeEndpoint(appId: string): string {
  return `/api/v2/apps/agent/${encodeURIComponent(appId)}/compatible-mode/v1/responses`;
}

/** 去掉百炼知识库的内部 ref 包装，同时保留用户可读的引用编号。 */
export function normalizeAssistantText(text: string): string {
  return text.replace(/<ref(?:\s[^>]*)?>\s*([\s\S]*?)\s*<\/ref>/gi, '$1');
}

const getErrorDetail = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') return null;

  const record = data as DashScopeResponseData;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  if (record.error && typeof record.error === 'object') {
    const error = record.error as DashScopeResponseData;
    if (typeof error.message === 'string') return error.message;
  }
  return null;
};

const extractOutputText = (data: unknown): string => {
  if (!data || typeof data !== 'object') return '';

  const record = data as DashScopeResponseData;
  if (typeof record.output_text === 'string') return record.output_text;

  if (!Array.isArray(record.output)) return '';

  return record.output
    .flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const message = item as DashScopeResponseData;
      if (typeof message.output_text === 'string') return [message.output_text];
      if (!Array.isArray(message.content)) return [];

      return message.content.flatMap((content) => {
        if (!content || typeof content !== 'object') return [];
        const part = content as DashScopeResponseData;
        return part.type === 'output_text' && typeof part.text === 'string' ? [part.text] : [];
      });
    })
    .join('');
};

const parseSseEvent = (
  rawEvent: string,
  onDelta: (delta: string) => void,
): { text: string; completedText: string } => {
  const lines = rawEvent.split(/\r?\n/);
  const eventType = lines
    .find((line) => line.startsWith('event:'))
    ?.slice(6)
    .trim();
  const data = lines
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');

  if (!data || data === '[DONE]') return { text: '', completedText: '' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    throw new Error('DashScope 返回了无法解析的流式数据。');
  }

  const record = parsed as DashScopeResponseData;
  if (record.type === 'response.output_text.delta' && typeof record.delta === 'string') {
    onDelta(record.delta);
    return { text: record.delta, completedText: '' };
  }

  if (record.type === 'error' || eventType === 'error') {
    throw new Error(`DashScope 流式请求失败：${getErrorDetail(record) ?? '服务返回错误事件。'}`);
  }

  return { text: '', completedText: extractOutputText(record.response ?? record) };
};

const readResponseError = async (response: Response): Promise<Error> => {
  const rawBody = await response.text().catch(() => '');
  let detail = rawBody.trim();

  if (detail) {
    try {
      detail = getErrorDetail(JSON.parse(detail)) ?? detail;
    } catch {
      // 非 JSON 的错误正文直接作为可诊断信息使用。
    }
  }

  return new Error(`DashScope 请求失败（HTTP ${response.status}）：${detail || response.statusText || '未知错误。'}`);
};

/**
 * 读取 DashScope Responses 响应：仅将 output_text.delta 交给 UI，忽略 reasoning 内容。
 * 同时兼容关闭 stream 后返回的标准 Responses JSON 对象。
 */
export async function readDashScopeResponse(
  response: Response,
  onDelta: (delta: string) => void = () => undefined,
): Promise<string> {
  if (!response.ok) throw await readResponseError(response);

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/event-stream')) {
    const data: unknown = await response.json().catch(() => {
      throw new Error('DashScope 返回了无法解析的 JSON 响应。');
    });
    const text = extractOutputText(data);
    if (text) return text;
    throw new Error(`DashScope 响应中没有可用回答。${getErrorDetail(data) ?? ''}`);
  }

  if (!response.body) throw new Error('DashScope 流式响应没有可读取的数据流。');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let text = '';
  let completedText = '';

  const consumeEvent = (event: string) => {
    const result = parseSseEvent(event, onDelta);
    text += result.text;
    if (result.completedText) completedText = result.completedText;
  };

  while (true) {
    const { done, value } = await reader.read();
    pending += decoder.decode(value, { stream: !done });

    let separatorIndex = pending.search(/\r?\n\r?\n/);
    while (separatorIndex !== -1) {
      consumeEvent(pending.slice(0, separatorIndex));
      pending = pending.slice(separatorIndex).replace(/^\r?\n\r?\n/, '');
      separatorIndex = pending.search(/\r?\n\r?\n/);
    }

    if (done) break;
  }

  if (pending.trim()) consumeEvent(pending);
  if (text) return text;
  if (completedText) return completedText;
  throw new Error('DashScope 流式响应中没有 output_text 内容。');
}
