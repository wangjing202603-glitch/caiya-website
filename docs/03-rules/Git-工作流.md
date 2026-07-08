# Git 工作流

> 最后更新：2026-07-01 · 维护人：@工程负责人

## 1. 分支策略

- **主干**：`main` 始终可部署；保护分支，需 PR + 1 名维护者审批
- **开发**：`develop` 集成测试；日常 PR 的目标分支
- **特性**：`feat/<scope>/<short-desc>`
- **修复**：`fix/<scope>/<short-desc>`
- **文档**：`docs/<short-desc>`
- **热修**：`hotfix/<short-desc>` → 直合 `main` + 回灌 `develop`
- **发布**：`release/vX.Y.Z`（阶段 2 起）

> `<scope>` 例：`kb`、`payment`、`ai`、`auth`、`ui`、`infra`

## 2. 提交信息（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type**：

- `feat`：新功能
- `fix`：Bug 修复
- `docs`：仅文档
- `style`：格式（不影响代码）
- `refactor`：重构（不修 bug 也不加功能）
- `perf`：性能
- `test`：测试
- `chore`：构建、依赖、工具
- `revert`：回滚
- `content`：知识库内容

**subject**：

- 中文 / 英文均可，**保持一致**（团队约定）
- ≤ 50 字符
- 不大写结尾、不加句号
- 用动词开头："新增""修复""调整"

**例**：

```
feat(payment): 接入微信支付 V3 Native 扫码

- 封装 PaymentProvider 接口
- 增加订单状态机
- 提供沙箱联调脚本

Closes #123
```

**破坏性变更**：在 footer 写 `BREAKING CHANGE: <description>`

## 3. Commit 粒度

- 1 个 commit = 1 个原子改动
- 不提交"半成品"
- WIP → 用 `wip:` 前缀 + 不推送 / 用 PR Draft

## 4. Pull Request

- 使用 [`templates/PULL_REQUEST.md`](../../templates/PULL_REQUEST.md)
- 标题 ≤ 70 字；与首个 commit 信息一致
- 描述包含：
  - 动机 / 解决了什么问题
  - 主要改动点
  - 截图 / 录屏（UI 改动）
  - 风险与回滚
  - 关联 Issue
- **PR 模板勾选项**全部勾完才可合入
- 超过 400 行的 PR 拆小

## 5. Review 流程

- 自审 → CI 绿 → 同事 review → SME review（按需）→ 合入
- 涉及支付、AI 提示词、数据库 schema → **2 名**维护者
- 24 小时内未 review → 作者在群内 @

## 6. Review 准则

- 评论分 3 类：
  - **必须改**（`[must]`）：阻塞合入
  - **建议改**（`[nit]`）：可后续 PR 修
  - **讨论**（`[discuss]`）：可选，作者回应即可
- 礼貌：先肯定，再说"我看到一个问题"
- 不在 review 中做"风格争论"——用工具（Prettier）解决

## 7. 合并策略

- 默认 **Squash merge**：PR 历史 = 1 个 commit
- 涉及 release 的多 commit 改动 → **Merge commit**
- 合并后自动删除源分支

## 8. 标签

| 标签 | 用途 |
|---|---|
| `bug` | Bug |
| `feature` | 新功能 |
| `docs` | 文档 |
| `content` | 知识库内容 |
| `ai` | AI 相关 |
| `payment` | 支付相关 |
| `security` | 安全 |
| `urgent` | 紧急 |
| `good first issue` | 适合新人 |
| `help wanted` | 求援 |

## 9. Issue 模板

- [`templates/ISSUE_BUG.md`](../../templates/ISSUE_BUG.md)
- [`templates/ISSUE_FEATURE.md`](../../templates/ISSUE_FEATURE.md)

## 10. 保护规则（GitHub）

- `main` / `develop` 必须 status check 全绿
- 必须 1+ 审批（高风险 2+）
- 必须线性历史（无 merge commit）
- 必须 up-to-date

## 11. 发布标签

- 合入 `main` 后打 `vX.Y.Z` 标签
- CHANGELOG 同步更新
- 触发 Vercel 生产部署

## 12. 事故 / 回滚

- `hotfix/<short>` 直合 `main`
- 旧版本回滚：`git revert <tag>` 或 Vercel "Promote Previous"
- 写事故复盘（`skills/事故复盘.md`）
