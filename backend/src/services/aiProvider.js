/**
 * AI 回答生成入口。
 * 第 9 节：MockAiProvider
 * 第 10 节：在此切换为 DeepSeekProvider，接口结构保持不变。
 */
const mockAi = require('./mockAi');

const deepSeekService = require('./deepSeekService');

const PROVIDERS = {
  mock: mockAi,
  deepseek: deepSeekService,
};

function getProvider() {
  const name = process.env.AI_PROVIDER || 'mock';
  const provider = PROVIDERS[name];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${name}`);
  }
  return provider;
}

async function generateAnswer(input) {
  const provider = getProvider();
  return provider.generate(input);
}

function getSourceLabel() {
  return process.env.AI_PROVIDER === 'deepseek' ? 'deepseek' : 'mock';
}

module.exports = { generateAnswer, getSourceLabel };
