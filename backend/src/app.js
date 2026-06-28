require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const subjectsRouter = require('./routes/subjects');
const chatRouter = require('./routes/chat');
const historyRouter = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/subjects', subjectsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/history', historyRouter);

const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`AI provider: ${process.env.AI_PROVIDER || 'mock'} (第 10 节可切换 deepseek)`);
});
