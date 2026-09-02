/**
 * 生成问题和答案的markdown文档
 * 调用API获取每个问题的答案
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://tyfhistory.com/api/chat';

const questionsConfig = {
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
};

async function fetchAnswer(question) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const data = JSON.parse(responseText);

    let answer = '';
    if (data && typeof data.answer === 'string') {
      answer = data.answer;
    } else if (data && typeof data.reply === 'string') {
      answer = data.reply;
    } else if (data && typeof data.response === 'string') {
      answer = data.response;
    } else if (typeof data === 'string') {
      answer = data;
    } else {
      throw new Error('Invalid response format');
    }

    return answer;
  } catch (error) {
    console.error(`Error fetching answer for question: ${question}`, error);
    return `[Error: ${error.message}]`;
  }
}

async function generateQADocument() {
  console.log('开始生成问题和答案文档...\n');

  const results = {
    EN: [],
    CN: [],
  };

  // 获取英文问题的答案
  console.log('正在获取英文问题的答案...');
  for (let i = 0; i < questionsConfig.EN.length; i++) {
    const question = questionsConfig.EN[i];
    console.log(`[${i + 1}/20] ${question}`);
    const answer = await fetchAnswer(question);
    results.EN.push({ question, answer });
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n正在获取中文问题的答案...');
  // 获取中文问题的答案
  for (let i = 0; i < questionsConfig.CN.length; i++) {
    const question = questionsConfig.CN[i];
    console.log(`[${i + 1}/20] ${question}`);
    const answer = await fetchAnswer(question);
    results.CN.push({ question, answer });
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 生成markdown文档
  let markdown = '# 通远坊历史记忆 - 问题与答案对照表\n\n';
  markdown += `生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n`;
  markdown += '---\n\n';

  // 英文部分
  markdown += '## 英文问题与答案\n\n';
  results.EN.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.question}\n\n`;
    markdown += `**答案:**\n\n${item.answer}\n\n`;
    markdown += '---\n\n';
  });

  // 中文部分
  markdown += '## 中文问题与答案\n\n';
  results.CN.forEach((item, index) => {
    markdown += `### ${index + 1}. ${item.question}\n\n`;
    markdown += `**答案:**\n\n${item.answer}\n\n`;
    markdown += '---\n\n';
  });

  // 保存文件
  const outputPath = path.join(__dirname, '..', 'QA_DOCUMENT.md');
  fs.writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`\n文档已生成: ${outputPath}`);
}

// 运行脚本
generateQADocument().catch(console.error);
