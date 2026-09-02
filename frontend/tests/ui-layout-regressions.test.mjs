import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('封面按钮不再叠加自带文字的背景图', async () => {
  const source = await readSource('../src/pages/Cover.tsx');
  assert.doesNotMatch(source, /assetsConfig\.cover\.buttonImage/);
});

test('聊天消息按内容自然撑开，输入区留在页面布局内', async () => {
  const source = await readSource('../src/pages/Chat.css');
  assert.match(source, /\.chat-messages\s*\{[^}]*flex:\s*0 0 auto;/s);
  assert.doesNotMatch(source, /\.chat-input-area\s*\{[^}]*position:\s*fixed;/s);
});

test('应用外层不再把所有页面强制压缩为 375px', async () => {
  const [indexCss, appCss] = await Promise.all([
    readSource('../src/index.css'),
    readSource('../src/App.css'),
  ]);
  assert.doesNotMatch(`${indexCss}\n${appCss}`, /max-width:\s*375px/);
});

test('轮播图为新增的图注与计数提供可见样式', async () => {
  const source = await readSource('../src/components/Carousel.css');
  assert.match(source, /\.carousel-caption\s*\{/);
  assert.match(source, /\.carousel-count\s*\{/);
});

test('轮播进度在图片底部居中且只显示紧凑小圆点', async () => {
  const source = await readSource('../src/components/Carousel.css');
  const dotsRule = source.match(/\.carousel-dots\s*\{([^}]*)\}/s)?.[1];
  const dotRule = source.match(/\.carousel-dot\s*\{([^}]*)\}/s)?.[1];

  assert.ok(dotsRule, '轮播圆点容器必须具有独立样式规则');
  assert.match(dotsRule, /bottom:\s*8px;/);
  assert.match(dotsRule, /left:\s*50%;/);
  assert.match(dotsRule, /transform:\s*translateX\(-50%\);/);
  assert.match(dotsRule, /background:\s*transparent;/);
  assert.doesNotMatch(dotsRule, /top:/);

  assert.ok(dotRule, '每个轮播圆点必须具有独立点击区');
  assert.match(dotRule, /width:\s*24px;/);
  assert.match(dotRule, /height:\s*24px;/);
  assert.match(source, /\.carousel-dot::after\s*\{[^}]*width:\s*6px;[^}]*height:\s*6px;/s);
  assert.match(source, /\.carousel-dot\.active::after\s*\{[^}]*width:\s*8px;[^}]*height:\s*8px;/s);
  assert.doesNotMatch(source, /@media\s*\(max-width:\s*360px\)[\s\S]*?\.carousel-dots\s*\{[^}]*display:\s*none;/s);
});

test('详情页保持顶部、独立滚动正文和底部操作栏三段玻璃布局', async () => {
  const [detailSource, detailCss, carouselCss, indexHtml] = await Promise.all([
    readSource('../src/pages/Detail.tsx'),
    readSource('../src/pages/Detail.css'),
    readSource('../src/components/Carousel.css'),
    readSource('../index.html'),
  ]);

  assert.match(
    indexHtml,
    /<meta\s+name=["']viewport["'][^>]*content=["'][^"']*\bviewport-fit=cover\b[^"']*["'][^>]*>/i,
  );

  // 正文容器只包含轮播、标签和主内容，底部操作栏是其后的 flex 兄弟。
  assert.match(
    detailSource,
    /<header className="detail-header">[\s\S]*?<\/header>\s*<div className="detail-scroll-content">\s*<div className="detail-carousel">[\s\S]*?<main[\s\S]*?className="detail-content"[\s\S]*?<\/main>\s*<\/div>\s*<div className="detail-actions">/,
  );

  assert.match(
    detailCss,
    /\.detail-page\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*height:\s*100vh;[^}]*height:\s*100dvh;[^}]*overflow:\s*hidden;/s,
  );
  assert.match(detailCss, /\.detail-header\s*\{[^}]*flex:\s*0 0 auto;[^}]*safe-area-inset-top/s);
  assert.match(detailCss, /\.detail-header\s*\{[^}]*grid-template-columns:\s*44px\s+minmax\(0,\s*1fr\)\s+72px;/s);
  assert.match(detailCss, /\.detail-header\s*\{[^}]*padding-right:\s*max\(12px,\s*env\(safe-area-inset-right\)\);/s);
  assert.match(detailCss, /\.detail-header\s*\{[^}]*padding-left:\s*max\(12px,\s*env\(safe-area-inset-left\)\);/s);
  assert.match(
    detailCss,
    /@media\s*\(max-width:\s*340px\)\s*\{[\s\S]*?\.detail-header\s*\{[^}]*grid-template-columns:\s*44px\s+minmax\(0,\s*1fr\)\s+72px;[^}]*padding-right:\s*max\(8px,\s*env\(safe-area-inset-right\)\);[^}]*padding-left:\s*max\(8px,\s*env\(safe-area-inset-left\)\);/s,
  );

  const backButtonRule = detailCss.match(/\.detail-back-button\s*\{([^}]*)\}/s)?.[1];
  assert.ok(backButtonRule, '返回按钮必须具有独立样式规则');
  for (const dimension of ['width', 'height']) {
    const values = Array.from(
      backButtonRule.matchAll(new RegExp(`(?:^|;)\\s*(?:min-)?${dimension}:\\s*(\\d+(?:\\.\\d+)?)px`, 'g')),
      (match) => Number(match[1]),
    );
    assert.ok(values.some((value) => value >= 44), `返回按钮${dimension}点击区不得小于 44px`);
  }
  assert.match(detailCss, /\.detail-header\s+\.language-switch\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(
    detailCss,
    /\.detail-scroll-content\s*\{[^}]*flex:\s*1 1 auto;[^}]*min-height:\s*0;[^}]*padding-right:\s*env\(safe-area-inset-right\);[^}]*padding-left:\s*env\(safe-area-inset-left\);[^}]*overflow-y:\s*auto;/s,
  );
  assert.match(detailCss, /\.detail-actions\s*\{[^}]*flex:\s*0 0 auto;[^}]*safe-area-inset-bottom/s);
  assert.match(detailCss, /\.detail-actions\s*\{[^}]*padding-right:\s*max\(16px,\s*env\(safe-area-inset-right\)\);/s);
  assert.match(detailCss, /\.detail-actions\s*\{[^}]*padding-left:\s*max\(16px,\s*env\(safe-area-inset-left\)\);/s);
  assert.doesNotMatch(detailCss, /\.detail-page\s*\{[^}]*safe-area-inset-bottom/s);

  for (const selector of ['detail-header', 'detail-actions']) {
    assert.match(detailCss, new RegExp(`\\.${selector}\\s*\\{[^}]*background:\\s*rgba\\(54,\\s*32,\\s*24,\\s*0\\.88\\);`, 's'));
    assert.match(detailCss, new RegExp(`\\.${selector}\\s*\\{[^}]*?(?<!-)backdrop-filter:\\s*blur\\([^;]+\\);`, 's'));
    assert.match(detailCss, new RegExp(`\\.${selector}\\s*\\{[^}]*-webkit-backdrop-filter:\\s*blur\\([^;]+\\);`, 's'));
  }

  assert.match(carouselCss, /\.carousel-button\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);

  assert.match(
    detailCss,
    /@supports\s+not\s+\(\(backdrop-filter:\s*blur\(1px\)\)\s+or\s+\(-webkit-backdrop-filter:\s*blur\(1px\)\)\)\s*\{[\s\S]*?\.detail-header,\s*\.detail-actions\s*\{[^}]*background:\s*#362018;/i,
  );
});
