# 阶段 1 落地笔记

> 最后更新：2026-07-01 · 维护人：@工程负责人
> 这是从"文档 + 代码生成"过渡到"本地跑通"的一次性指引。

## 0. 为什么没在沙箱里跑

- 沙箱无外网（`registry.npmjs.org` 与 `registry.npmmirror.com` 都连不通）
- 沙箱无 `pnpm`、无 npm 全局写权限
- 因此"装包 / build"由您在**本机终端**完成
- 我（Agent）只生成代码 + 内容 + 文档

## 1. 跑通步骤（5~10 分钟）

### 1.1 前置

- Node ≥ 18.17（您机器是 24，✅）
- 推荐装 `pnpm`（`npm i -g pnpm`）；不想装也可用 `npm`

### 1.2 装包

```powershell
cd F:\AI工具\AI财务网址搭建\web
pnpm install
# 或：npm install
```

> 第一次会下载 ~300 个包，国内网络 1~3 分钟。如超时：换 `npm config set registry https://registry.npmmirror.com` 再试。

### 1.3 启动

```powershell
pnpm dev
# 或：npm run dev
```

打开 http://localhost:3000 应该看到首页。

### 1.4 验证关键页面

- `/` 首页
- `/kb` 知识库总览
- `/kb/ru-men-zhi-nan` 入门指南分类
- `/kb/ru-men-zhi-nan/welcome` 示例文章
- `/kb/search?q=发票&mode=ai` 搜索 + AI 占位
- `/pricing` 定价

### 1.5 生产构建

```powershell
pnpm build
```

## 2. 预期看到的页面

### 首页
- 顶部 hero "把重复劳动留给机器，把判断留给自己。"
- 3 张价值主张卡片
- 6 个分类卡片
- 6 篇最近文章
- AI 问答 CTA 横幅

### 文章详情
- 左侧分类树（≥ lg 显示）
- 中间正文：标题 / 元信息 / callout（部分文章）/ MDX 内容 / 反馈区 / 相关推荐
- 右侧目录（≥ xl 显示，自动高亮当前章节）
- 顶部面包屑

### 搜索
- 顶部 ⌘K 搜索框，模式切换 搜索 / 问 AI
- 默认"热门文章"列表
- 有 query 时显示搜索结果
- `?mode=ai` 时显示 AI 占位回答 + 引用来源（阶段 3 替换）

## 3. 排错速查

### 3.1 装包失败 / 网络慢

```powershell
npm config set registry https://registry.npmmirror.com
# 重新装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3.2 `Module not found: gray-matter`

`gray-matter` 没装上。重跑 `pnpm install`；如仍失败直接 `pnpm add gray-matter`。

### 3.3 `Cannot find module '@/...'`

`tsconfig.json` 的 `paths` 没生效。删除 `.next` 与 `tsconfig.tsbuildinfo` 后重启：

```powershell
Remove-Item -Recurse -Force .next, tsconfig.tsbuildinfo
pnpm dev
```

### 3.4 `KaTeX CSS not loaded`

确认 `app/layout.tsx` 里有 `import "katex/dist/katex.min.css"`。

### 3.5 编译报 rehype 插件错误

`rehype-katex` 7.x 与 `next-mdx-remote` 5.x 兼容；如报版本冲突：

```powershell
pnpm add rehype-katex@^7.0.1 katex@^0.16.11
```

### 3.6 `pnpm build` 报 TypeScript 错

跑 `pnpm typecheck` 单独看类型。常见：

- MDX 文件没填 Frontmatter → 补齐
- `_index.json` 解析失败 → 校验 JSON

## 4. 跑通后建议

- 截图首页 / KB 总览 / 详情页（移动端 + 暗色）
- 把截图发我，我看实际效果
- 有任何"看起来怪"的地方告诉我，我改

## 5. 阶段 1 实际产物清单

- ✅ `web/package.json` + `tsconfig.json` + `next.config.mjs` + `tailwind.config.ts` + `postcss.config.mjs` + `components.json` + `.eslintrc.json`
- ✅ 全局样式 + 设计令牌：`app/globals.css` + `tailwind.config.ts`
- ✅ 主题：`components/layout/theme-provider.tsx`（极简自研，免装 `next-themes`）
- ✅ 顶栏 / 底栏：`components/layout/{topbar,footer}.tsx`
- ✅ 知识库组件：`KbSidebar` `KbToc` `KbCard` `KbBreadcrumb` `Callout` `Paywall` `SearchBar`
- ✅ 页面：`/` `/about` `/pricing` `/auth/sign-in` `/legal/{terms,privacy}` `/not-found` `/kb` `/kb/[category]` `/kb/[category]/[slug]` `/kb/search`
- ✅ 数据层：`lib/kb.ts`（gray-matter + 文件系统）+ `lib/mdx.tsx`（next-mdx-remote + remark-gfm + rehype-slug + rehype-katex）
- ✅ 内容：`web/content/kb/_index.json` + 30 篇 MDX（每分类 5 篇，覆盖所有 6 个一级分类）
- ✅ SEO：每篇文章注入 JSON-LD `Article`
- ✅ A11y：面包屑 `aria-current`、Toc `aria-label`、Skip-link 占位可在 layout 加

## 6. 没做的（阶段 2~3）

- ❌ Prisma / DB（阶段 2 接入）
- ❌ Auth.js 真实登录（阶段 2）
- ❌ 微信 / 支付宝支付（阶段 2）
- ❌ pgvector / 真实 RAG（阶段 3）
- ❌ shadcn 拉组件（阶段 1 没用 shadcn，自研极简组件足够；阶段 2 视需要拉）
- ❌ Playwright e2e（阶段 1 不强制）

## 7. 风险与回退

- **风险 1**：`rehype-katex` 与新版 `next-mdx-remote` 可能版本不兼容
  - 回退：把 `rehype-katex` 改为内置的简单行内公式（去掉 `$...$` 支持）
- **风险 2**：中文标题 slug 与 `rehype-slug` 默认实现不一致
  - 已用自研 `slugify`，但若用浏览器跳转锚点时仍需保证一致
- **风险 3**：`rehype-katex` 对含中文的公式不友好
  - 实际中文场景公式罕见，可忽略

## 8. 进度同步

您在本机跑通后：

1. 截图发我 → 我看视觉
2. 把 `pnpm build` 警告/错误贴我 → 我修
3. 试用搜索 / 切换暗色 → 反馈体验

跑通后下一步：

- 阶段 2 启动（Prisma + Auth.js + 支付）
- 或先把内容扩到 60~100 篇（按 [`templates/kb-article.mdx`](../templates/kb-article.mdx) 模板）


## 9. v2 视觉改造（2026-07-01）

参考 starglowai.com/kb 杂志感气质，做的调整：

- **背景色**：米白 → 纯白 `#FFFFFF`
- **标题字号**：5xl/6xl → 5xl/6xl/7xl（hero 段最大）
- **副标题字号**：16px → 14-15px
- **hero padding-top**：96px → 40~56px（紧凑）
- **数字大字**：4xl → 5xl
- **删除冗余**：原"成为会员 →" 暖橙链接
- **新增"最近更新"块**：左侧暖橙竖条 + "最近更新 · 2 天前" 标签 + 标题链接（更接近 starglowai）
- **板块标题**：3xl → 4xl/5xl/6xl
- **顶栏**：h-16 → h-14，logo 字号 19px → 15px
- **KbCard**：px-5 py-4 → px-4 py-3；标题 lg → base

主色（editorial 主题）：

- 主按钮：`#0F0F0F`（近黑）
- 强调色：`#F2691F`（暖橙）
- 背景：`#FFFFFF`（纯白）
- 边框：`#E5E5E5`（极浅灰）

字体策略：标题 Source Han Serif SC italic；正文 Inter / Noto Sans SC。

## 10. v3 视觉改造（2026-07-01 晚）

按 starglowai 主页 + 12 周训练营页气质做的调整：

**首页结构（自上而下）**：

1. **营销 Hero**（两栏）
   - 左：价值主张 "用 AI 提效 80% 的财务工作"（3xl-5xl 衬线斜体）
   - 右：4 个数字大字卡（30+ 篇 / 12 周 / 6 大板块 / 27/6 首期），右上角 SVG 圆点装饰
2. **最近更新条**（左侧暖橙竖条 + 标题链接）
3. **6 大板块** tag 导航（第一个黑底高亮）
4. **12 周训练计划**（参考图 2，规则卡片 4 列网格）
5. **最近文章**（3 列 KbCard）
6. **AI 问答 CTA**

**关键改动**：

- Hero 标题从"欢迎回来" → "用 AI 提效 80% 的财务工作"（功能性，更对路）
- 字号全面降一档：h1 5xl/6xl/7xl → 3xl/4xl/5xl
- 副标题 16/17px → 14/15px
- prose-kb 字号统一调小
- 标题 italic 范围收窄：h1/h2 斜体，h3 不斜体
- 加 SVG 圆点装饰（参考 starglowai 主页中央）
- 加 fade-in-up 动画（数字卡 + 时间线卡）

**新组件**：

- `DotsOrnament`：12x12 圆点螺旋 SVG