const pool = require('../db/pool');

async function insert({ subjectCode, grade, question, answerJson, answerSource }) {
  const [result] = await pool.query(
    `INSERT INTO qa_records (subject_code, grade, question, answer_json, answer_source)
     VALUES (?, ?, ?, ?, ?)`,
    [subjectCode, grade, question, JSON.stringify(answerJson), answerSource]
  );
  return result.insertId;
}

async function findRecent(limit) {
  const [rows] = await pool.query(
    `SELECT id, subject_code AS subject, grade, question,
            answer_source AS source, created_at AS createdAt
     FROM qa_records
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt).toISOString(),
  }));
}

module.exports = { insert, findRecent };
