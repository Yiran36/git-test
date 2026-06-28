const express = require('express');
const subjectRepo = require('../repositories/subjectRepo');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const subjects = await subjectRepo.findAll();
    res.json({ subjects });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
