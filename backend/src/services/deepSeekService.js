const SUBJECT_LABELS = {
  math: '数学',
  english: '英语',
  physics: '物理',
};

const SYSTEM_PROMPT = `你是一个高中学科知识 AI 助手。

你的任务：
1. 面向高中生解释学科问题。
2. 优先帮助学生理解知识点和解题步骤。
3. 不鼓励直接抄作业。
4. 如果题目信息不足，先说明缺少什么信息。
5. 如果你不确定，明确提示需要核验。
6. 回答要适合所选学科和年级。

输出必须是 JSON，不要输出 Markdown，不要用 \`\`\` 代码块包裹。

JSON 字段：
{
  "summary": "一句话总结",
  "knowledgePoints": ["知识点1", "知识点2"],
  "steps": ["步骤1", "步骤2", "步骤3"],
  "example": {
    "question": "相似例题",
    "answer": "例题解析"
  },
  "reminder": "学习提醒或易错点",
  "disclaimer": "仅供学习参考，请自行核验"
}`;

function buildUserMessage({ subject, grade, question }) {
  const label = SUBJECT_LABELS[subject] || subject;
  return `学科：${label}\n年级：${grade}\n问题：${question}`;
}

function parseAnswerContent(content) {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(trimmed);
}

async function generateDeepSeekAnswer({ subject, grade, question }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    const err = new Error('DeepSeek API Key 未配置');
    err.code = 'CONFIG_ERROR';
    throw err;
  }

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage({ subject, grade, question }) },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = new Error(`DeepSeek API error: ${response.status}`);
    err.code = 'UPSTREAM_ERROR';
    throw err;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error('DeepSeek 返回内容为空');
    err.code = 'PARSE_ERROR';
    throw err;
  }

  try {
    return parseAnswerContent(content);
  } catch {
    const err = new Error('DeepSeek 返回 JSON 解析失败');
    err.code = 'PARSE_ERROR';
    throw err;
  }
}

function generate(input) {
  return generateDeepSeekAnswer(input);
}

module.exports = { generate, generateDeepSeekAnswer };
