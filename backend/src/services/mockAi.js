const MATH_KEYWORDS = ['二次函数', '最值', '函数'];
const ENGLISH_KEYWORDS = ['语法', '阅读', '作文', '时态'];
const PHYSICS_KEYWORDS = ['牛顿', '力', '运动', '加速度'];

function pickTemplate(subject, question) {
  const q = question.toLowerCase();

  if (subject === 'math') {
    if (MATH_KEYWORDS.some((k) => question.includes(k))) {
      return {
        summary: '二次函数最值通常由开口方向和顶点决定。',
        knowledgePoints: ['二次函数', '顶点式', '配方法'],
        steps: [
          '先判断二次项系数 a 的正负。',
          '再求顶点横坐标 x = -b / 2a。',
          '把 x 代回函数得到最值。',
        ],
        example: {
          question: '求 y = x² - 4x + 1 的最小值。',
          answer: '配方得 y = (x - 2)² - 3，所以最小值是 -3。',
        },
        reminder: '考试中要写清楚取到最值时的 x。',
      };
    }
    return {
      summary: '数学问题建议先明确已知条件与求解目标，再选择合适方法。',
      knowledgePoints: ['审题', '公式应用', '验算'],
      steps: [
        '读题，标注已知量和未知量。',
        '回忆相关公式或定理。',
        '按步骤推导并检验结果是否合理。',
      ],
      example: {
        question: '示例：已知等差数列首项与公差，求第 n 项。',
        answer: '使用 an = a1 + (n - 1)d 代入计算。',
      },
      reminder: '写清每一步依据，避免跳步失分。',
    };
  }

  if (subject === 'english') {
    if (ENGLISH_KEYWORDS.some((k) => question.includes(k))) {
      return {
        summary: '英语题目要先判断考点（语法结构、语篇逻辑或表达层次），再针对性作答。',
        knowledgePoints: ['语法结构', '语境理解', '表达准确性'],
        steps: [
          '定位句子主干，找出主谓宾。',
          '判断时态、语态或从句类型。',
          '结合上下文选择最自然的表达。',
        ],
        example: {
          question: '改错：He go to school every day.',
          answer: '主语 He 为第三人称单数，谓语改为 goes。',
        },
        reminder: '作文要注意段落衔接与高级词汇的准确使用，不要堆砌生僻词。',
      };
    }
    return {
      summary: `针对「${question.slice(0, 30)}」这类英语问题，建议从词汇、语法、语篇三个层面分析。`,
      knowledgePoints: ['词汇辨析', '句型结构', '语篇连贯'],
      steps: [
        '提取题干关键词，判断题型。',
        '回顾相关语法规则或阅读技巧。',
        '组织答案，注意用完整句表达。',
      ],
      example: {
        question: '阅读理解：如何快速定位细节题答案？',
        answer: '扫读题干关键词，回原文同义定位，对比选项排除干扰。',
      },
      reminder: '答题时用原文依据支撑，避免主观臆断。',
    };
  }

  if (subject === 'physics') {
    if (PHYSICS_KEYWORDS.some((k) => question.includes(k))) {
      return {
        summary: '力学问题通常需要画出受力分析图，再列方程求解。',
        knowledgePoints: ['牛顿定律', '受力分析', '运动学公式'],
        steps: [
          '确定研究对象，画出受力图。',
          '建立坐标系，分解力或加速度。',
          '根据牛顿第二定律 F=ma 列式求解。',
        ],
        example: {
          question: '水平面上物体受拉力 F 摩擦系数 μ，求加速度。',
          answer: 'F - μmg = ma，解得 a = (F - μmg) / m。',
        },
        reminder: '注意单位统一，计算结果检验量纲是否合理。',
      };
    }
    return {
      summary: '物理题解题关键是建立正确的物理模型，明确已知与未知量。',
      knowledgePoints: ['物理模型', '公式选择', '单位换算'],
      steps: [
        '分析物理过程，画示意图。',
        '列出相关物理定律或公式。',
        '代入数据求解并检验数量级。',
      ],
      example: {
        question: '示例：自由落体求落地速度。',
        answer: 'v² = 2gh，代入 h 和 g 求得 v。',
      },
      reminder: '写清公式来源与符号含义，步骤分清晰。',
    };
  }

  return {
    summary: `已收到你的${subject}问题，以下是结构化学习建议。`,
    knowledgePoints: ['基础概念', '解题方法'],
    steps: ['理解题意', '回顾知识点', '分步解答'],
    example: { question: question.slice(0, 50), answer: '请参考上述步骤尝试解答。' },
    reminder: '有疑问可继续追问具体步骤。',
  };
}

function generate({ subject, grade, question }) {
  const base = pickTemplate(subject, question);
  return {
    ...base,
    summary: `【${grade}】${base.summary}`,
  };
}

module.exports = { generate };
