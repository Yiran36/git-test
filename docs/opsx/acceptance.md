# 验收标准：高中学科知识 AI 网站 MySQL/Git MVP

本文档为第 9 节 MVP 的 **Definition of Done**。全部必选项通过，方可视为本期交付完成。

---

## 1. 环境与基础设施

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| E-01 | Docker Compose 可启动 MySQL | 执行 `docker compose up -d`，容器状态为 Up | 必 |
| E-02 | 数据库 `subject_ai` 存在 | 连接后 `SHOW DATABASES` 可见 | 必 |
| E-03 | 表 `subjects`、`qa_records` 存在且结构正确 | `DESCRIBE subjects;` / `DESCRIBE qa_records;` 字段与 design 一致 | 必 |
| E-04 | `subjects` 含 math / english / physics 初始数据 | `SELECT * FROM subjects;` 至少 3 条 | 必 |
| E-05 | `sql/init.sql` 可重复执行或文档说明初始化方式 | 新 volume 启动后自动或手动 init 成功 | 必 |
| E-06 | `.env` 未提交至 Git | `git log` / 仓库中无真实密码与 Key | 必 |

---

## 2. API：GET /api/subjects

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| S-01 | 返回 HTTP 200 | curl / 浏览器 / Postman | 必 |
| S-02 | 响应体含 `subjects` 数组 | JSON 结构符合 `docs/api.md` | 必 |
| S-03 | 每项含 `code`、`name`、`gradeRange` | 字段名 camelCase，值与数据库一致 | 必 |
| S-04 | 至少返回 3 个学科 | math、english、physics | 必 |

**示例验证命令**

```bash
curl -s http://localhost:3000/api/subjects | jq .
```

（端口以实际后端为准）

---

## 3. API：POST /api/chat

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| C-01 | 合法请求返回 HTTP 200/201 | 见下方示例 body | 必 |
| C-02 | 响应含 `id`（数字）、`source`（`mock`）、`answer` 对象 | JSON 结构符合 api.md | 必 |
| C-03 | `answer` 含 summary、knowledgePoints、steps、example、reminder | 五项均非空（数组至少 1 项） | 必 |
| C-04 | 每次成功调用写入 `qa_records` 一行 | 调用前后 `SELECT COUNT(*)` 增加 1 | 必 |
| C-05 | 写入字段正确 | subject_code、grade、question、answer_json、answer_source=`mock` | 必 |
| C-06 | 缺少 subject/grade/question 返回 4xx | 分别 omit 字段测试 | 必 |
| C-07 | 空 question 返回 4xx | `question: ""` 或仅空格 | 必 |
| C-08 | Mock 逻辑在后端 | 前端 Network 面板无第三方 AI 域名请求 | 必 |
| C-09 | 不同 subject 答案内容有区分 | math / english 各问一题，summary 或 steps 不同 | 选 |

**示例验证命令**

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"subject":"math","grade":"高一","question":"二次函数怎么求最值？"}' | jq .
```

**数据库验证**

```sql
SELECT id, subject_code, grade, question, answer_source, created_at
FROM qa_records ORDER BY id DESC LIMIT 1;
```

---

## 4. API：GET /api/history

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| H-01 | 默认或 `?limit=5` 返回 HTTP 200 | curl 测试 | 必 |
| H-02 | 响应含 `records` 数组 | JSON 结构符合 api.md | 必 |
| H-03 | 每条含 id、subject、grade、question、source、createdAt | 字段完整 | 必 |
| H-04 | 按 `created_at` 降序 | 最新记录在数组首位 | 必 |
| H-05 | `limit` 生效 | 插入 6 条后 `?limit=5` 仅返回 5 条 | 必 |
| H-06 | 响应不含完整 answer 对象 | 与 api.md 示例一致（仅元信息） | 必 |
| H-07 | `createdAt` 为 ISO 8601 格式 | 如 `2026-06-01T10:00:00.000Z` | 必 |

**示例验证命令**

```bash
curl -s "http://localhost:3000/api/history?limit=5" | jq .
```

---

## 5. 前端功能

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| F-01 | 页面加载后展示学科选项 | 数据来自 API，非硬编码假数据 | 必 |
| F-02 | 可选择年级（高一/高二/高三） | UI 可操作 | 必 |
| F-03 | 可输入问题并提交 | 点击提交触发 POST /api/chat | 必 |
| F-04 | 提交后展示结构化答案 | summary、知识点、步骤、例题、提醒均可见 | 必 |
| F-05 | 展示最近历史记录 | 调用 GET /api/history，至少显示 question 与学科 | 必 |
| F-06 | 新提问后历史列表更新 | 提交成功后列表含刚提的问题 | 必 |
| F-07 | 提交中有 loading 或禁用防重复 | 用户体验可接受 | 选 |
| F-08 | API 错误有提示 | 断网或 4xx 时不 silent fail | 选 |
| F-09 | 前端代码中无 API Key | 搜索 `sk-`、`DEEPSEEK`、`apiKey` 等无结果 | 必 |
| F-10 | 前端不直连 DeepSeek 或任何 AI 服务 | Network 面板仅见自家后端 | 必 |

---

## 6. 安全与约束

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| SEC-01 | 无登录注册功能 | 代码与 UI 均无账号体系 | 必 |
| SEC-02 | 不采集学生敏感个人信息 | 无姓名、手机、身份证等字段与表单 | 必 |
| SEC-03 | AI Key 仅允许出现在后端环境变量（第 9 节为空） | 仓库全文搜索无 Key | 必 |
| SEC-04 | 第 9 节未调用真实 DeepSeek API | 后端无 deepseek.com 等外呼 | 必 |

---

## 7. 文档

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| D-01 | `docs/api.md` 与实现一致 | 对照三个接口实测响应 | 必 |
| D-02 | `docs/opsx/proposal.md` 存在 | 文件可读 | 必 |
| D-03 | `docs/opsx/design.md` 存在 | 文件可读 | 必 |
| D-04 | `docs/opsx/tasks.md` 存在 | 文件可读 | 必 |
| D-05 | `docs/opsx/acceptance.md` 存在 | 本文件 | 必 |
| D-06 | README 含本地启动说明 | 新人可按 README 跑起来 | 必 |

---

## 8. Git 实践

| ID | 验收项 | 验证方法 | 必/选 |
|----|--------|----------|-------|
| G-01 | 提交历史反映分步开发 | `git log --oneline` 有多条语义化 commit | 必 |
| G-02 | commit message 可读 | 含 docs/feat/chore/fix 等前缀 | 必 |
| G-03 | 无 `.env`、node_modules 等误提交 | 仓库干净 | 必 |
| G-04 | main 或演示分支包含完整 MVP | 切换分支可演示 | 必 |

---

## 9. 端到端场景测试（演示脚本）

按以下脚本操作，全程无报错即通过 **E2E-01**：

1. `docker compose up -d` 启动 MySQL
2. 启动后端服务
3. 打开前端页面
4. 确认学科列表加载（数学、英语、物理）
5. 选择 **数学** + **高一**
6. 输入：「二次函数怎么求最值？」
7. 提交后页面展示结构化答案
8. 历史区域出现该问题，source 为 mock
9. 在 MySQL 中确认 `qa_records` 新增记录
10. 再选 **英语** 提一个问题，确认 Mock 内容与数学不同（选验 C-09）

| ID | 验收项 | 必/选 |
|----|--------|-------|
| E2E-01 | 上述 10 步全流程通过 | 必 |

---

## 10. 第 10 节预留验收（本期不验）

以下仅供后续替换 DeepSeek 时使用，**第 9 节不要求通过**：

| ID | 验收项 |
|----|--------|
| P10-01 | 设置 `AI_PROVIDER=deepseek` 后 POST /api/chat 仍返回相同 JSON 结构 |
| P10-02 | `answer_source` 为 `deepseek` |
| P10-03 | 前端无需修改即可工作 |
| P10-04 | API Key 仍仅存在于后端环境变量 |

---

## 11. 验收结论模板

验收人填写：

```
验收日期：
验收分支 / commit：
必选项通过数：__ / __
未通过项：
  - [ID] 说明
备注：
结论：□ 通过  □ 不通过，需修复后复验
```

---

## 12. 快速自检清单（勾选版）

**必选项全部勾选 = MVP 完成**

- [ ] E-01 ~ E-06 环境与基础设施
- [ ] S-01 ~ S-04 subjects API
- [ ] C-01 ~ C-08 chat API + 写库
- [ ] H-01 ~ H-07 history API
- [ ] F-01 ~ F-06、F-09、F-10 前端核心
- [ ] SEC-01 ~ SEC-04 安全约束
- [ ] D-01 ~ D-06 文档齐全
- [ ] G-01 ~ G-04 Git 实践
- [ ] E2E-01 端到端演示
