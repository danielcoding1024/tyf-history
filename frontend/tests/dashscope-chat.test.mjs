import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildDashScopeRequest,
  getDashScopeEndpoint,
  normalizeAssistantText,
  readDashScopeResponse,
} from '../src/lib/dashscope-chat.ts';

test('百炼请求携带完整对话历史和流式开关', () => {
  const request = buildDashScopeRequest([
    { role: 'user', content: '通远坊是什么？' },
    { role: 'assistant', content: '通远坊是一个历史宗教社区。' },
    { role: 'user', content: '它为什么重要？' },
  ]);

  assert.deepEqual(request, {
    input: [
      { role: 'user', content: '通远坊是什么？' },
      { role: 'assistant', content: '通远坊是一个历史宗教社区。' },
      { role: 'user', content: '它为什么重要？' },
    ],
    stream: true,
  });
});

test('百炼代理始终指向老师提供的应用 ID', () => {
  assert.equal(
    getDashScopeEndpoint('2617226b74144e26bd2b45038894763c'),
    '/api/v2/apps/agent/2617226b74144e26bd2b45038894763c/compatible-mode/v1/responses',
  );
});

test('流式响应只拼接 output_text 增量', async () => {
  const response = new Response([
    'event: response.created\n',
    'data: {"type":"response.created"}\n\n',
    'event: response.output_text.delta\n',
    'data: {"type":"response.output_text.delta","delta":"通远"}\n\n',
    'event: response.reasoning_text.delta\n',
    'data: {"type":"response.reasoning_text.delta","delta":"隐藏思考"}\n\n',
    'event: response.output_text.delta\n',
    'data: {"type":"response.output_text.delta","delta":"坊"}\n\n',
    'event: response.completed\n',
    'data: {"type":"response.completed"}\n\n',
  ].join(''), {
    headers: { 'Content-Type': 'text/event-stream' },
  });
  const deltas = [];

  const text = await readDashScopeResponse(response, (delta) => deltas.push(delta));

  assert.deepEqual(deltas, ['通远', '坊']);
  assert.equal(text, '通远坊');
});

test('非流式 Responses 对象也能提取回答', async () => {
  const response = Response.json({
    status: 'completed',
    output: [{
      type: 'message',
      role: 'assistant',
      content: [{ type: 'output_text', text: '知识库回答' }],
    }],
  });

  assert.equal(await readDashScopeResponse(response), '知识库回答');
});

test('知识库内部 ref 标签只保留可读引用编号', () => {
  assert.equal(
    normalizeAssistantText('通远坊位于高陵<ref>[1]</ref>，始建于清代<ref>[2][3]</ref>。'),
    '通远坊位于高陵[1]，始建于清代[2][3]。',
  );
});
