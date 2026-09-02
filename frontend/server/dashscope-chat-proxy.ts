import { Buffer } from 'node:buffer'
import type { IncomingMessage, ServerResponse } from 'node:http'

export const DASHSCOPE_APP_ID = '2617226b74144e26bd2b45038894763c'
export const DASHSCOPE_RESPONSES_URL =
  `https://dashscope.aliyuncs.com/api/v2/apps/agent/${DASHSCOPE_APP_ID}/compatible-mode/v1/responses`

type FetchImplementation = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

interface DashScopeChatMiddlewareOptions {
  apiKey?: string
  fetchImpl?: FetchImplementation
}

type JsonRecord = Record<string, unknown>

const readErrorMessage = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null

  const record = value as JsonRecord
  if (typeof record.message === 'string') return record.message
  if (typeof record.error === 'string') return record.error
  if (record.error && typeof record.error === 'object') {
    const nestedMessage = readErrorMessage(record.error)
    if (nestedMessage) return nestedMessage
  }
  if (record.response && typeof record.response === 'object') {
    return readErrorMessage(record.response)
  }

  return null
}

const redact = (message: string, apiKey: string): string => (
  apiKey ? message.split(apiKey).join('[已隐藏]') : message
)

const sendJsonError = (
  response: ServerResponse,
  statusCode: number,
  message: string,
): void => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify({ error: message }))
}

const readRequestBody = async (request: IncomingMessage): Promise<Buffer> => {
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

const getSseData = (rawEvent: string): { eventType: string; data: string } => {
  let eventType = ''
  const dataLines: string[] = []

  for (const line of rawEvent.split(/\r?\n/)) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart())
    }
  }

  return { eventType, data: dataLines.join('\n') }
}

const serializeSseEvent = (eventType: string, data: JsonRecord): string => (
  `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
)

/**
 * 只允许最终回答增量和必要的终止事件通过；所有事件均重新序列化，
 * 避免 response.completed 中的完整 reasoning/output 被浏览器看到。
 */
export const filterDashScopeSseEvent = (rawEvent: string, apiKey = ''): string => {
  const { eventType, data } = getSseData(rawEvent)
  if (!data) return ''
  if (data === '[DONE]') {
    return serializeSseEvent('response.completed', { type: 'response.completed' })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(data)
  } catch {
    if (eventType === 'error') {
      return serializeSseEvent('error', { type: 'error', message: '百炼服务返回了错误事件。' })
    }
    return ''
  }

  if (!parsed || typeof parsed !== 'object') return ''
  const record = parsed as JsonRecord
  const type = typeof record.type === 'string' ? record.type : eventType

  // event 与 data 类型不一致时丢弃，防止借用允许类型伪装其他事件。
  if (eventType && type !== eventType) return ''

  if (type === 'response.output_text.delta' && typeof record.delta === 'string') {
    return serializeSseEvent(type, { type, delta: record.delta })
  }

  if (type === 'response.completed' || type === 'response.incomplete') {
    return serializeSseEvent(type, { type })
  }

  if (type === 'error' || type === 'response.failed') {
    const message = redact(readErrorMessage(record) ?? '百炼服务返回了错误事件。', apiKey)
    return serializeSseEvent('error', { type: 'error', message })
  }

  return ''
}

const writeFilteredStream = async (
  upstream: Response,
  response: ServerResponse,
  apiKey: string,
): Promise<void> => {
  const reader = upstream.body?.getReader()
  if (!reader) {
    sendJsonError(response, 502, '百炼服务没有返回可读取的数据流。')
    return
  }

  response.statusCode = 200
  response.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  response.setHeader('Cache-Control', 'no-cache, no-transform')
  response.setHeader('X-Accel-Buffering', 'no')
  response.flushHeaders()

  const decoder = new TextDecoder()
  let pending = ''

  const consumePendingEvents = (): void => {
    let match = /\r?\n\r?\n/.exec(pending)
    while (match?.index !== undefined) {
      const rawEvent = pending.slice(0, match.index)
      pending = pending.slice(match.index + match[0].length)
      const filtered = filterDashScopeSseEvent(rawEvent, apiKey)
      if (filtered) response.write(filtered)
      match = /\r?\n\r?\n/.exec(pending)
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      pending += decoder.decode(value, { stream: !done })
      consumePendingEvents()
      if (done) break
    }

    if (pending.trim()) {
      const filtered = filterDashScopeSseEvent(pending, apiKey)
      if (filtered) response.write(filtered)
    }
  } catch {
    response.write(serializeSseEvent('error', {
      type: 'error',
      message: '读取百炼流式响应失败，请稍后再试。',
    }))
  } finally {
    response.end()
  }
}

const readUpstreamError = async (upstream: Response, apiKey: string): Promise<string> => {
  const rawBody = await upstream.text().catch(() => '')
  if (!rawBody) return `百炼请求失败（HTTP ${upstream.status}）。`

  try {
    const parsed: unknown = JSON.parse(rawBody)
    return redact(readErrorMessage(parsed) ?? `百炼请求失败（HTTP ${upstream.status}）。`, apiKey)
  } catch {
    return `百炼请求失败（HTTP ${upstream.status}）。`
  }
}

/** Vite 开发服务中的 `/api/chat` 服务端处理器。 */
export const createDashScopeChatMiddleware = ({
  apiKey = '',
  fetchImpl = fetch,
}: DashScopeChatMiddlewareOptions) => async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJsonError(response, 405, '仅支持 POST 请求。')
    return
  }

  if (!apiKey) {
    sendJsonError(response, 503, 'DASHSCOPE_API_KEY 未配置，聊天服务暂不可用。')
    return
  }

  let requestBody: Buffer
  try {
    requestBody = await readRequestBody(request)
  } catch {
    sendJsonError(response, 400, '无法读取聊天请求。')
    return
  }

  let upstream: Response
  try {
    const body = requestBody.buffer.slice(
      requestBody.byteOffset,
      requestBody.byteOffset + requestBody.byteLength,
    ) as ArrayBuffer
    upstream = await fetchImpl(DASHSCOPE_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': request.headers['content-type'] ?? 'application/json',
      },
      body,
    })
  } catch {
    sendJsonError(response, 502, '连接百炼服务失败，请稍后再试。')
    return
  }

  if (!upstream.ok) {
    sendJsonError(response, upstream.status, await readUpstreamError(upstream, apiKey))
    return
  }

  const contentType = upstream.headers.get('content-type') ?? ''
  if (!contentType.includes('text/event-stream')) {
    sendJsonError(response, 502, '百炼服务未返回流式响应。')
    return
  }

  await writeFilteredStream(upstream, response, apiKey)
}
