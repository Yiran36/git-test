# 高中学科知识 AI 网站

第 9 节课堂 MVP：面向高中生的学习辅助网站，前端提问、后端 Mock AI 结构化回答、MySQL 持久化。

> **第 10 节预告**：将 Mock AI 替换为 DeepSeek API。接口路径与 JSON 结构保持不变，仅在后端 `aiProvider.js` 切换 Provider，`AI_PROVIDER=deepseek` + `DEEPSEEK_API_KEY` 环境变量。**API Key 仅存在于后端，不会出现在前端代码中。**

## MVP 功能

- 学科选择：数学、英语、物理
- 年级选择：高一、高二、高三
- 问题输入与提交（调用 `POST /api/chat`）
- 结构化答案展示：summary、knowledgePoints、steps、example、reminder
- 最近 5 条历史记录（来自 `GET /api/history`，存 MySQL，不用 LocalStorage）

## 项目结构

```
.
├── docker-compose.yml       # MySQL 8.0
├── sql/init.sql             # 建表 + 初始学科数据
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── db/pool.js
│       ├── routes/          # subjects, chat, history
│       ├── services/        # mockAi.js, aiProvider.js
│       └── repositories/
├── frontend/                # Vue 3 + Vite
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.vue
│       ├── api.js
│       └── components/      # ChatForm, AnswerPanel, HistoryList
└── docs/api.md              # 接口契约
```

## 快速启动

### 1. 启动 MySQL

```bash
docker compose up -d
```

若 3306 端口被占用，先停止冲突容器或修改 `docker-compose.yml` 端口映射。

### 2. 构建前端

```bash
cd frontend
npm install
npm run build
```

### 3. 启动后端

```bash
cd backend
cp .env.example .env
npm install
npm start
```

服务默认运行在 http://localhost:3000 ，托管 `frontend/dist` 静态文件。

### 4. 打开网站

浏览器访问 http://localhost:3000

### 开发模式（热更新）

前后端分开启动，Vite 会将 `/api` 代理到后端：

```bash
# 终端 1：后端
cd backend && npm start

# 终端 2：前端
cd frontend && npm run dev
```

浏览器访问 http://localhost:5173

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/subjects` | 获取学科列表 |
| POST | `/api/chat` | 提交问题，Mock AI 回答并写入 `qa_records` |
| GET | `/api/history?limit=5` | 获取最近问答历史 |

详见 [docs/api.md](docs/api.md)。

## 环境变量

| 变量 | 说明 |
|------|------|
| `DB_*` | MySQL 连接配置 |
| `PORT` | 后端端口，默认 3000 |
| `AI_PROVIDER` | 第 9 节填 `mock`；第 10 节改为 `deepseek` |
| `DEEPSEEK_API_KEY` | 第 10 节使用，第 9 节留空 |

## 限制说明

- 不接真实 DeepSeek API（第 9 节）
- 不做登录注册
- 不采集学生敏感个人信息
- 核心历史记录存 MySQL，不依赖 LocalStorage
