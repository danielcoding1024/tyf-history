import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';

const proxyModule = await import('../server/dashscope-chat-proxy.ts').catch(() => null);

const loadProxyModule = () => {
  assert.ok(proxyModule, '应提供服务端百炼代理辅助模块');
  return proxyModule;
};

const listen = async (middleware) => {
  const server = createServer((request, response) => {
    void middleware(request, response, () => {
      response.statusCode = 404;
      response.end();
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  return {
    url: `http://127.0.0.1:${address.port}/api/chat`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
};

const chunkedSseResponse = (chunks) => new Response(new ReadableStream({
  start(controller) {
    const encoder = new TextEncoder();
    chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
    controller.close();
  },
}), {
  headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
});

test('服务端跨分块过滤 SSE，只把回答增量与脱敏完成事件发给浏览器', async () => {
  const { createDashScopeChatMiddleware } = loadProxyModule();
  const upstream = chunkedSseResponse([
    'event: response.reasoning_text.delta\r\ndata: {"type":"response.reasoning_text.delta","delta":"隐藏思考一"}\r\n',
    '\r\nevent: response.output_text.delta\r\ndata: {"type":"response.output_text.delta","delta":"通远"}\r',
    '\n\r\nevent: response.reasoning_summary_text.delta\ndata: {"type":"response.reasoning_summary_text.delta","delta":"隐藏思考二"}\n\n',
    'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"坊"}\n\n',
    'event: response.completed\ndata: {"type":"response.completed","response":{"status":"completed","output":[{"type":"reasoning","summary":[{"text":"完整隐藏思考"}]}]}}\n\n',
  ]);
  const middleware = createDashScopeChatMiddleware({
    apiKey: 'server-secret',
    fetchImpl: async () => upstream,
  });
  const local = await listen(middleware);

  try {
    const response = await fetch(local.url, { method: 'POST', body: '{}' });
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') ?? '', /^text\/event-stream/);
    assert.match(body, /"delta":"通远"/);
    assert.match(body, /"delta":"坊"/);
    assert.match(body, /"type":"response.completed"/);
    assert.doesNotMatch(body, /reasoning|隐藏思考|server-secret/);
  } finally {
    await local.close();
  }
});

test('服务端使用固定应用地址和环境密钥，并逐字节原样转发完整请求 body', async () => {
  const {
    DASHSCOPE_RESPONSES_URL,
    createDashScopeChatMiddleware,
  } = loadProxyModule();
  const requestBody = '{\n  "input": [{"role":"user","content":"第一问"},{"role":"assistant","content":"第一答"},{"role":"user","content":"第二问"}],\n  "stream": true\n}\n';
  let captured;
  const middleware = createDashScopeChatMiddleware({
    apiKey: 'server-secret',
    fetchImpl: async (input, init) => {
      captured = {
        input: String(input),
        authorization: new Headers(init?.headers).get('authorization'),
        contentType: new Headers(init?.headers).get('content-type'),
        body: new TextDecoder().decode(init?.body),
      };
      return chunkedSseResponse([
        'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"回答"}\n\n',
      ]);
    },
  });
  const local = await listen(middleware);

  try {
    await fetch(local.url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer browser-supplied-key',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: requestBody,
    });

    assert.deepEqual(captured, {
      input: DASHSCOPE_RESPONSES_URL,
      authorization: 'Bearer server-secret',
      contentType: 'application/json; charset=utf-8',
      body: requestBody,
    });
  } finally {
    await local.close();
  }
});

test('未配置密钥时返回 JSON 且不会请求上游', async () => {
  const { createDashScopeChatMiddleware } = loadProxyModule();
  let upstreamCalled = false;
  const middleware = createDashScopeChatMiddleware({
    apiKey: '',
    fetchImpl: async () => {
      upstreamCalled = true;
      throw new Error('不应调用');
    },
  });
  const local = await listen(middleware);

  try {
    const response = await fetch(local.url, { method: 'POST', body: '{}' });
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
    assert.equal(typeof body.error, 'string');
    assert.equal(upstreamCalled, false);
  } finally {
    await local.close();
  }
});

test('上游 HTTP 错误和网络错误都转换为 JSON', async (t) => {
  const { createDashScopeChatMiddleware } = loadProxyModule();

  await t.test('保留上游 HTTP 状态与错误信息', async () => {
    const middleware = createDashScopeChatMiddleware({
      apiKey: 'server-secret',
      fetchImpl: async () => Response.json({ error: { message: '应用未发布' } }, { status: 400 }),
    });
    const local = await listen(middleware);

    try {
      const response = await fetch(local.url, { method: 'POST', body: '{}' });
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: '应用未发布' });
    } finally {
      await local.close();
    }
  });

  await t.test('网络异常返回 502', async () => {
    const middleware = createDashScopeChatMiddleware({
      apiKey: 'server-secret',
      fetchImpl: async () => {
        throw new Error('socket closed server-secret');
      },
    });
    const local = await listen(middleware);

    try {
      const response = await fetch(local.url, { method: 'POST', body: '{}' });
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { error: '连接百炼服务失败，请稍后再试。' });
    } finally {
      await local.close();
    }
  });
});
