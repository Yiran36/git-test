const pool = require('../db/pool');

const SUBJECT_NAMES = {
  math: '数学',
  english: '英语',
  physics: '物理',
};

async function findAll() {
  const [rows] = await pool.query(
    'SELECT code, name, grade_range AS gradeRange FROM subjects ORDER BY code'
  );
  return rows.map((row) => ({
    code: row.code,
    name: SUBJECT_NAMES[row.code] || row.name?.trim() || row.code,
    gradeRange: SUBJECT_NAMES[row.code] ? '高一-高三' : (row.gradeRange?.trim() || '高一-高三'),
  }));
}

module.exports = { findAll };
