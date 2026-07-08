# AGENTS.md — 给所有 AI Agent 的总则

> **每一个进入本仓库工作的 AI Agent，在做任何事之前都必须读完本文件。**
> 本文件是项目的"宪法"；任何与之冲突的具体规则，以本文件为准。

---

## 1. 项目是什么

- 产品：**AI 财务社群 · AI 财务知识库**（中文）。
- 目标用户：中小企业财务、个体工商户、独立会计师、对 AI 感兴趣的个人。
- 核心价值：用 AI 减少重复劳动（记账、报税、报表、合同审阅），把判断留给人。
- 关键参考：[starglowai.com/kb](https://starglowai.com/kb) 的双栏布局与内容组织。
- 当前阶段：**阶段 0（基建）**：本仓库只沉淀系统性文档与模板，**不写应用代码**。

---

## 2. 你的工作边界

### ✅ 可以做

- 阅读 `docs/` `memory/` `skills/` `templates/` 下的所有文件。
- 在 `docs/` `memory/` `skills/` `templates/` `content/kb/` 下面**新增或修改** Markdown / JSON 配置文件。
- 写**占位**性质的 `package.json` / `.env.example` / `tsconfig.json` 等配置文件。
- 运行**只读**类命令（`ls`、`cat`、`rg`、`git status`、`git log`）以及**非破坏性**的检查命令（`pnpm typecheck` 之类），前提是不会修改任何被 Git 跟踪的文件。

### ❌ 不可以做

- 写实际的 TypeScript / React / Prisma / Next.js 业务代码（阶段 1 才会开始）。
- 安装 npm 依赖、跑 `pnpm install`、`npx create-next-app` 等。
- 连接任何真实数据库、支付、第三方 API。
- 直接修改 `LICENSE`、`CODE_OF_CONDUCT.md` 的实质性条款（如果要改，必须先开 Issue 讨论）。
- `git commit` / `git push` / 切分支——除非用户**显式**要求。
- 删改 `memory/项目记忆.md` 已记录的决策而无 ADR。

---

## 3. 强制阅读顺序

1. 本文件 `AGENTS.md`（即你正在读的这个）。
2. `README.md` 了解目录结构。
3. `docs/01-vision/产品愿景.md` 理解产品。
4. `docs/01-vision/路线图.md` 知道当前在哪个阶段。
5. 按任务类型读：
   - 写内容 → `docs/02-design/内容样式指南.md` + `templates/kb-article.mdx`
   - 写规则 → `docs/03-rules/` 对应文件
   - 写决策 → `templates/ADR.md` + `memory/decisions/`
6. 写完后检查 `memory/未决问题.md`，看是否需要同步登记新发现的问题。

---

## 4. 输出风格

- 文件名：中文文件名允许（与 `docs/` 现有风格一致），但**所有可执行脚本、配置文件名用英文 kebab-case**。
- 编码：UTF-8 无 BOM。
- 换行：LF（即使在 Windows 上工作，也保持 LF；CI 配 `.gitattributes` 强制）。
- 中英文混排：中文正文用全角标点；英文/代码/数字前后留 1 个空格。
- 引号：优先用「」""（中文），代码片段内用半角。
- 引用资料：使用 [标题](URL) 形式，不要用 Markdown reference 链接（不便扫读）。

---

## 5. 决策与冲突处理

- **冲突优先级**：用户/开发者直接指令 > 本文件 > `docs/03-rules/*` > `skills/*` > 其他文档。
- **不确定时**：先在 `memory/未决问题.md` 登记，再继续做能做的事，**不要反复问**。
- **重要决策**：必须写 ADR（`memory/decisions/ADR-XXXX-标题.md`），并把要点同步进 `memory/项目记忆.md`。
- **与现状矛盾**：如果发现仓库现状与文档不符，**以文档为准**更新代码；现状更合理时，开 Issue 讨论后改文档并写 ADR。

---

## 6. 协作礼仪

- 不在文档里写"未来将做 X"这种无主语的承诺；写"在 YYYY-MM 之前由 @负责人 完成 X"。
- 每个文档顶部加 `> 最后更新：YYYY-MM-DD · 维护人：@xxx`（可后续填）。
- 删除内容时**先看是否需要保留历史**：业务逻辑删到 `memory/历史经验.md`；过时决策删到 ADR 末尾的"被取代记录"小节。
- 任何对用户/会员/财务/税务业务的承诺性表述，**必须**有 SME（领域专家）评审标记，模板见 `templates/`。

---

## 7. 自检清单（每次收工前过一遍）

- [ ] 涉及到的文件类型（设计/规则/技能/模板）都看了对应 `docs/` 章节
- [ ] 新增/修改的文档顶部更新了最后更新日期
- [ ] 新决策写了 ADR
- [ ] 未决问题在 `memory/未决问题.md` 登记
- [ ] 模板文件改动同步到 `templates/`
- [ ] 没动 `LICENSE`、`CODE_OF_CONDUCT.md`、`AGENTS.md` 实质条款
- [ ] 没跑任何会改 Git 跟踪文件的命令
