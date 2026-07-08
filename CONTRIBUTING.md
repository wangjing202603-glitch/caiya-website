# CONTRIBUTING.md — 贡献指南

欢迎来到 AI 财务社群！本指南同时面向**人类贡献者**与 **AI Agent**。

---

## 1. 行为准则

所有参与者都必须遵守 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)。违反准则的 PR / Issue 会被关闭，行为严重者会被移除。

---

## 2. 我能贡献什么

| 类型 | 在哪里 | 谁来审 |
|---|---|---|
| 知识库内容（文章、案例、模板） | `content/kb/**` | 1 名财务/税务 SME + 1 名编辑 |
| 设计资源（Figma、插画、图标） | 设计仓库（后续建立） | 设计负责人 |
| 系统性文档 | `docs/` `memory/` `skills/` `templates/` | 维护团队 |
| 代码 | 阶段 1 起，PR 入主仓 | 维护团队 |
| Bug 报告 / 功能建议 | GitHub Issue | 维护团队 triage |

---

## 3. 知识库内容贡献流程（推荐路径）

1. **选话题**：在 GitHub Discussions 的「内容选题」板块领题，或自荐开新帖。
2. **写大纲**：用 [`templates/kb-article.mdx`](./templates/kb-article.mdx) 的 Frontmatter 填好元数据，再列 3~7 个二级标题。
3. **拉分支**：`git checkout -b kb/<分类>/<slug>`。
4. **写正文**：遵循 [`docs/02-design/内容样式指南.md`](./docs/02-design/内容样式指南.md)。
5. **自检**：
   - [ ] 标题 ≤ 30 字，描述 ≤ 120 字
   - [ ] 关键事实有 SME 复核签字
   - [ ] 引用资料用 `[标题](URL)` 形式
   - [ ] 截图/图表放在 `content/kb/<分类>/<slug>/assets/`
   - [ ] 跑过 `pnpm lint:content`（阶段 1 后启用）
6. **提 PR**：使用 [PR 模板](./templates/PULL_REQUEST.md)，关联对应 Issue / Discussion。
7. **评审**：SME 看专业性，编辑看表达与一致性。
8. **合并**：Squash merge，自动部署到预览环境，编辑点「通过」后合入主干并发布。

---

## 4. 代码贡献流程（阶段 1 起启用）

1. 先读 [`docs/03-rules/代码规范.md`](./docs/03-rules/代码规范.md) 与 [`docs/03-rules/Git-工作流.md`](./docs/03-rules/Git-工作流.md)。
2. Issue 分配或自由领取；超过 200 行改动先写 RFC（在 `docs/05-rfcs/` 下）。
3. 分支命名：`feat/xxx`、`fix/xxx`、`chore/xxx`、`docs/xxx`。
4. 提交信息遵循 Conventional Commits。
5. 推送后 CI 会跑 `lint / typecheck / test / build`，全部绿才可合入。
6. 至少 1 名维护者 Code Review 通过；涉及支付、AI 提示词的改动需 2 名。
7. 合并后自动部署到 Vercel Preview；维护者在 Vercel 里点「Promote to Production」。

---

## 5. 报告 Bug

- 使用 [Bug 模板](./templates/ISSUE_BUG.md)。
- 提供：复现步骤、期望/实际、浏览器、账号（如可）、截图/录屏。
- 涉及资金/支付/会员状态的 Bug 标 `severity:critical`，会优先处理。

---

## 6. 提 Feature

- 使用 [Feature 模板](./templates/ISSUE_FEATURE.md)。
- 写清楚：动机、用户故事、验收标准、不在范围内的事项。
- 维护团队会在 5 个工作日内回复是否纳入路线图。

---

## 7. 安全问题

**请勿**在公开 Issue 提报安全问题。发送邮件到 `security@aicaiwu.cn`（占位邮箱，需在 ICP 备案后启用），我们会在 72 小时内回复。

---

## 8. AI Agent 贡献者

- Agent 必须读 [`AGENTS.md`](./AGENTS.md) 并严格遵守其中的边界。
- Agent 生成的 PR 标题前缀：`[agent/<model>] `，例如 `[agent/codex] docs: 补充 ADR-0002 错误码规范`。
- Agent 不能：
  - 自作主张修改 `LICENSE` / `AGENTS.md` / `CODE_OF_CONDUCT.md` 实质条款
  - 自作主张发起新分支或 commit
  - 跑任何会修改 Git 跟踪文件的命令

---

## 9. 致谢

每位贡献者都会出现在 README 致谢区与年度社群年报中。重大贡献者可获年度会员 + 周边礼包。
