import test from 'node:test';
import assert from 'node:assert/strict';
import {
  architectureStages,
  historicalEvents,
  historicalFigures,
  historyStages,
  overviewContent,
  siteCopy,
} from '../src/config/detail-content.config.ts';

for (const language of ['CN', 'EN']) {
  test(`${language} content has the required record counts`, () => {
    assert.equal(historyStages[language].length, 4);
    assert.equal(historicalEvents[language].length, 9);
    assert.equal(historicalFigures[language].length, 15);
    assert.equal(architectureStages[language].length, 5);
  });

  test(`${language} overview and architecture use the approved year`, () => {
    assert.match(overviewContent[language].what, /1716/);
    assert.match(architectureStages[language][0].period, /1716/);
    assert.doesNotMatch(architectureStages[language][0].period, /1711/);
  });

  test(`${language} public copy is complete`, () => {
    assert.ok(siteCopy[language].reportTitle.length > 0);
    assert.ok(siteCopy[language].readOverview.length > 0);
    assert.ok(siteCopy[language].chatTitle.length > 0);
    assert.ok(siteCopy[language].chatGreeting.length > 0);
  });
}

test('history source periods are preserved independently of architecture correction', () => {
  assert.equal(historyStages.CN[0].period, '1711 年—1845 年');
  assert.equal(historyStages.EN[0].period, '1711–1845');
});

test('the English siege event keeps the Guo Jian family example from the source', () => {
  const event = historicalEvents.EN.find(({ title }) => title.includes('Liu Zhenhua'));
  assert.ok(event);
  assert.match(event.text, /Guo Jian/);
});

test('the public report title matches the approved bilingual copy', () => {
  assert.equal(siteCopy.CN.reportTitle, '通远坊的历史和建筑');
  assert.equal(siteCopy.EN.reportTitle, 'History and Architecture of Tongyuan Ward');
});
