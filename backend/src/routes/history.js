const express = require('express');
const qaRecordRepo = require('../repositories/qaRecordRepo');

const router = express.Router();

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

router.get('/', async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (Number.isNaN(limit) || limit < 1) {
      limit = DEFAULT_LIMIT;
    }
    limit = Math.min(limit, MAX_LIMIT);

    const records = await qaRecordRepo.findRecent(limit);
    res.json({ records });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
