import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const chatSource = await readFile(new URL('../src/pages/Chat.tsx', import.meta.url), 'utf8');

test('切换中英文不会重挂载 ChatSession 并清空既有对话', () => {
  assert.doesNotMatch(chatSource, /<ChatSession\s+key=\{language\}/);
  assert.match(chatSource, /return\s+<ChatSession\s+language=\{language\}\s*\/>;/);
  assert.match(
    chatSource,
    /const requestMessages:[^=]+=\s*\[\.\.\.messages, userMessage\]\.map\(\(message\)\s*=>/s,
  );
});

test('切换中英文只刷新推荐问题，不改写既有消息', () => {
  assert.match(
    chatSource,
    /useEffect\(\(\)\s*=>\s*\{\s*setSuggestedQuestions\(getRandomQuestions\(language\)\);\s*\},\s*\[language\]\);/s,
  );
  assert.doesNotMatch(
    chatSource,
    /useEffect\(\(\)\s*=>\s*\{[^}]*setMessages\([^}]*\},\s*\[language\]\)/s,
  );
});
