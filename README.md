# AI 财务社群 · AI Finance Community

> 让每个财务人都能用上 AI 助理，把重复劳动留给机器，把判断留给自己。

「AI 财务社群」是一个聚焦 **AI × 财务/税务/合规** 的中文知识社群，核心产品是 [AI 财务知识库](https://starglowai.com/kb) 同款体验的中文站点 + 会员订阅 + AI 问答助手。

本仓库目前处于 **阶段 0：基建**——只沉淀系统性文件（设计、规则、记忆、技能、模板），为后续实现打基础。

---

## 30 秒上手

1. 阅读 [`AGENTS.md`](./AGENTS.md)：所有 AI Agent 的总则。
2. 阅读 [`docs/01-vision/产品愿景.md`](./docs/01-vision/产品愿景.md)：了解我们在做什么、为谁做。
3. 按 `skills/` 里的流程完成任务；不清楚的先查 `memory/`。
4. 写代码前先看 [`docs/03-rules/代码规范.md`](./docs/03-rules/代码规范.md)。

---

## 目录导览

| 目录 | 作用 |
|---|---|
| `docs/01-vision/` | 愿景、用户画像、路线图 |
| `docs/02-design/` | 设计系统、信息架构、页面规范、A11y、内容样式 |
| `docs/03-rules/` | 代码、Git、DB、API、安全、支付、内容审核规范 |
| `docs/04-ops/` | 部署、监控、备份、事故响应 |
| `memory/` | 项目长期记忆：决策、术语、未决问题、历史 |
| `skills/` | Agent 任务流程（创建文章、接入支付、迁移 DB 等） |
| `templates/` | 知识库文章、ADR、PR、Issue、支付对接单模板 |
| `content/kb/` | 知识库内容源（MDX，Git 管理） |
| `scripts/` | 自动化脚本（占位） |
| `.github/` | Issue / PR 模板 |

---

## 技术栈速览

- 前端：Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- 后端：Next.js API Routes + Prisma + PostgreSQL
- 认证：Auth.js (NextAuth v5)
- 支付：微信支付 V3 + 支付宝
- AI：OpenAI 兼容 API + pgvector
- 部署：Vercel + Neon + 阿里云 OSS

详细选型理由见 [`memory/decisions/ADR-0001-技术栈.md`](./memory/decisions/ADR-0001-技术栈.md)。

---

## 许可证

- 代码：[MIT](./LICENSE)
- 知识库内容：[CC BY-NC-SA 4.0](./LICENSE-CONTENT)

---

## 维护者

社群主理人 + 维护团队。任何问题先开 Issue，紧急事务在微信群同步。
