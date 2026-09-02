import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('口述史按钮提供可见的播放状态文字，不再依赖深色位图', async () => {
  const source = await readSource('../src/pages/Detail.tsx');
  assert.match(source, /播放口述/);
  assert.match(source, /暂停播放/);
  assert.doesNotMatch(source, /assetsConfig\.voices\.(playing|muted)/);
});

test('详情正文使用浅色档案纸，并保持四个分类单行排列', async () => {
  const source = await readSource('../src/pages/Detail.css');
  assert.match(source, /\.detail-content\s*\{[^}]*background:\s*var\(--color-paper-panel\)/s);
  assert.match(source, /\.detail-tabs\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s);
});

test('推荐问题紧跟对话并使用一列文档式列表', async () => {
  const source = await readSource('../src/pages/Chat.css');
  assert.doesNotMatch(source, /\.chat-suggested-questions\s*\{[^}]*margin-top:\s*auto/s);
  assert.match(source, /\.suggested-list\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(source, /\.suggested-question\s*\{[^}]*background:\s*var\(--color-paper-panel\)/s);
});
