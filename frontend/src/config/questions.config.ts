/**
 * 建议问题配置
 * 中英文各20个问题，每次随机显示2个
 */

export const questionsConfig = {
  CN: [
    '通远坊是什么？',
    '通远坊为什么重要？',
    '通远坊天主教堂位于何处？',
    '通远坊天主教堂是由谁创建的？创建于何时？',
    '通远坊在西北天主教史上具有怎样的历史地位？',
    '通远坊何时成为西北天主教总堂？',
    '通远坊的历史可分为哪几个阶段？',
    '通远坊的建筑群有什么特点？',
    '通远坊建筑如何体现"中西合璧"？',
    '通远坊在文革期间几乎被拆，是什么最终保住了它？',
    '通远坊为什么叫"陕西总堂"？',
    '通远坊最值得看的建筑是哪几个？',
    '通远坊有哪些"灵异事件"？',
    '通远坊得以保存下来，经历了一些什么？',
    '通远坊有哪些重要的非物质文化遗产？',
    '通远坊为什么有城墙？它更像一个教堂还是一个堡垒？',
    '通远坊的由哪些机构组成？有什么作用？',
    '通远坊的现状如何？',
    '通远坊的"育嬰堂"和普通孤儿院有什么不同？',
    '为什么说通远坊是"适应性生存"的典范？',
  ],
  EN: [
    'What is Tongyuanfang?',
    'Why is Tongyuanfang important?',
    'Where is Tongyuanfang Catholic Church located?',
    'Who founded Tongyuanfang Catholic Church? When was it founded?',
    'What historical status does Tongyuanfang hold in the history of Catholicism in Northwest China?',
    'When did Tongyuanfang become the General See of Catholicism in Northwest China?',
    'Into how many stages can the history of Tongyuanfang be divided?',
    'What are the characteristics of Tongyuanfang\'s architectural complex?',
    'How does Tongyuanfang architecture embody "Chinese-Western integration"?',
    'Tongyuanfang was almost demolished during the Cultural Revolution, what ultimately saved it?',
    'Why is Tongyuanfang called "Shaanxi General See"?',
    'Which are the most worthwhile buildings to see in Tongyuanfang?',
    'What "supernatural events" are associated with Tongyuanfang?',
    'What did Tongyuanfang experience to be preserved?',
    'What important intangible cultural heritage does Tongyuanfang have?',
    'Why does Tongyuanfang have city walls? Is it more like a church or a fortress?',
    'What institutions make up Tongyuanfang? What are their functions?',
    'What is the current status of Tongyuanfang?',
    'What is the difference between Tongyuanfang\'s "orphanage" and ordinary orphanages?',
    'Why is Tongyuanfang considered a model of "adaptive survival"?',
  ],
};

/**
 * 从问题库中随机选择2个问题
 */
export function getRandomQuestions(language: 'CN' | 'EN'): string[] {
  const questions = questionsConfig[language];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
