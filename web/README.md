# 财芽 CaiYa · Web（阶段 1 内测版）

> Next.js 14 (App Router) + TypeScript + Tailwind + MDX。
> **内测已上线**：https://caiya-website.vercel.app
> GitHub 仓库：`wangjing202603-glitch/caiya-website`（Private，Vercel 自动部署）
> 部署指南：[`../../docs/02-design/内测部署指南_v1.md`](../../docs/02-design/内测部署指南_v1.md)

财芽 = AI × 财务实战知识库。8 板块 / 46 篇 / Amber Clarity 暖琥珀设计 / 付费墙分层（认知免费 + 实战会员）。

## 30 秒上手

```bash
cd web
npm install        # 或 pnpm install（推荐）
npm run dev        # 起 http://localhost:3000
```

首次启动会下载约 300 个包（耗时 1~3 分钟，看网络）。

## 关键脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发模式，文件改动热重载 |
| `npm run build` | 生产构建（验证能跑通） |
| `npm run start` | 跑生产构建 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## 目录结构

```
web/
├─ app/                  # 路由 + 页面
│  ├─ layout.tsx         # 根布局（Topbar / Footer / Theme）
│  ├─ page.tsx           # 首页
│  ├─ about/             # 关于
│  ├─ pricing/           # 定价
│  ├─ auth/sign-in/      # 登录（占位）
│  ├─ legal/             # 协议 / 隐私
│  ├─ not-found.tsx      # 404
│  └─ kb/
│     ├─ page.tsx        # 知识库总览
│     ├─ [category]/page.tsx
│     ├─ [category]/[slug]/page.tsx
│     └─ search/page.tsx
├─ components/
│  ├─ layout/            # Topbar / Footer / ThemeProvider
│  ├─ kb/                # Sidebar / Toc / Card / Breadcrumb / Callout / Paywall / SearchBar
│  └─ ui/                # shadcn 拉取后落地（阶段 1 未拉，按需添加）
├─ content/
│  └─ kb/
│     ├─ _index.json     # 分类树
│     └─ **/*.mdx        # 30 篇示例文章
├─ lib/
│  ├─ kb.ts              # 知识库数据层（gray-matter + fs）
│  ├─ mdx.tsx            # MDX 编译 + 目录抽取
│  └─ utils.ts           # cn() 工具
├─ app/globals.css       # 全局样式 + 设计令牌
├─ tailwind.config.ts    # 设计令牌 / 主题
├─ next.config.mjs
├─ tsconfig.json
└─ package.json
```

## 设计令牌

来自 [`docs/02-design/设计令牌.md`](../../docs/02-design/设计令牌.md)：

- 品牌色 `brand`（暖琥珀）：`#F09A1A` (500) — `hsl(33 95% 51%)`
- 辅助色 `accent`（增长青）：`#14B8A6`
- 中性 `ink`（暖中性）：9 级（`#FAFAF8` / `#F7F6F2` / `#1C1A18` / `#6B6B6B`...）
- 字体：**Noto Sans SC**（无衬线，全站统一，告别衬线 italic）
- 设计哲学：**Amber Clarity 琥珀澄明**（暖中性 + 单色琥珀 + 小圆角 ≤8px + 几何精工 + 大留白），参照 starglowai.com

修改令牌请改 `tailwind.config.ts` 和 `app/globals.css`，**不要**在组件里写裸值。

## 暗色模式

内置。点击顶栏右上角"🌙/☀️"切换；跟随系统。状态写入 `localStorage("theme")`。

## 知识库内容管理

1. 把 `.mdx` 放进 `web/content/kb/<分类目录>/`
2. 顶部 Frontmatter 必填：`title` `slug` `description` `category` `tags` `author` `reviewers` `status` `access` `createdAt` `updatedAt` `verifiedAt` `version`
3. `status: published` 的文章会被 `lib/kb.ts` 加载
4. `access: "member"` 或 `"pro"` 触发 `Paywall` 组件
5. 分类目录命名约定 `NN-分类名/`（参考 `_index.json`）

## 已知占位（阶段 2~3 补齐）

- 登录 / 注册 / 支付：阶段 2
- AI 真实问答（RAG）：阶段 3
- 后台 KB 编辑：阶段 5
- 真实统计（Plausible）：阶段 4
- 备案域名（caiya.cn / aicaiwu.cn）：内测稳定后买

## 排错

详见 [`../../docs/05-stage-1-handoff.md`](../../docs/05-stage-1-handoff.md)。
