const express = require('express');
const subjectRepo = require('../repositories/subjectRepo');
const qaRecordRepo = require('../repositories/qaRecordRepo');
const { generateAnswer, getSourceLabel } = require('../services/aiProvider');
const { generateDeepSeekAnswer } = require('../services/deepSeekService');

const router = express.Router();

const VALID_GRADES = ['高一', '高二', '高三'];
const MAX_QUESTION_LENGTH = 2000;

router.post('/', async (req, res, next) => {
  try {
    const { subject, grade, question } = req.body || {};

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ error: 'subject is required' });
    }
    if (!grade || !VALID_GRADES.includes(grade)) {
      return res.status(400).json({ error: 'grade must be 高一, 高二, or 高三' });
    }
    const trimmedQuestion = typeof question === 'string' ? question.trim() : '';
    if (!trimmedQuestion || trimmedQuestion.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({ error: 'question is required (1-2000 chars)' });
    }

    const subjects = await subjectRepo.findAll();
    const subjectCodes = subjects.map((s) => s.code);
    if (!subjectCodes.includes(subject)) {
      return res.status(400).json({ error: 'invalid subject code' });
    }

    const useDeepSeek = process.env.AI_PROVIDER === 'deepseek';
    let answer;

    try {
      answer = useDeepSeek
        ? await generateDeepSeekAnswer({ subject, grade, question: trimmedQuestion })
        : await generateAnswer({ subject, grade, question: trimmedQuestion });
    } catch (err) {
      if (err.code === 'CONFIG_ERROR') {
        return res.status(503).json({ error: 'DeepSeek API key not configured' });
      }
      if (err.code === 'PARSE_ERROR') {
        return res.status(502).json({ error: 'AI response parse failed' });
      }
      if (useDeepSeek) {
        console.error('DeepSeek error:', err.message);
        return res.status(502).json({ error: 'DeepSeek API request failed' });
      }
      throw err;
    }

    const source = getSourceLabel();

    const id = await qaRecordRepo.insert({
      subjectCode: subject,
      grade,
      question: trimmedQuestion,
      answerJson: answer,
      answerSource: source,
    });

    res.status(201).json({ id, source, answer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
