import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedDocuments = {
  'report-cn.pdf': 'bea25ddabfe82e3f19edfbd14e02d175cb4e0cdfd2ff100c9bb4c03b63756513',
  'report-en.pdf': '8a125efe4f525ed936f3fd6569027520ddf1a408cb3ae2120cfccbfc5bea7cff',
  'overview-cn.pdf': 'c5381773503b16a7c5616952232f3c8033ec7d46a5338d1ae3401fa1b0b151d7',
  'overview-en.pdf': 'eaafa5452f48bfef1993c8eff606efb0791216f179c3af4c93e2faac9409b4e2',
};

for (const [filename, expectedHash] of Object.entries(expectedDocuments)) {
  test(`${filename} 保持老师指定文章身份`, async () => {
    const data = await readFile(new URL(`../src/assets/book/${filename}`, import.meta.url));
    const actualHash = createHash('sha256').update(data).digest('hex');
    assert.equal(actualHash, expectedHash);
  });
}

test('首页研究报告与概述子页分别使用老师指定的两组文章', async () => {
  const assetsSource = await readFile(new URL('../src/config/assets.config.ts', import.meta.url), 'utf8');
  const homeSource = await readFile(new URL('../src/pages/Home.tsx', import.meta.url), 'utf8');
  const detailSource = await readFile(new URL('../src/pages/Detail.tsx', import.meta.url), 'utf8');

  assert.match(assetsSource, /reports:\s*\{\s*chinese:\s*reportCnPdf,\s*english:\s*reportEnPdf,/s);
  assert.match(assetsSource, /overviews:\s*\{\s*chinese:\s*overviewCnPdf,\s*english:\s*overviewEnPdf,/s);
  assert.match(homeSource, /window\.open\(getReportPdfPath\(language\)/);
  assert.match(detailSource, /href=\{getOverviewPdfPath\(language\)\}/);
});
