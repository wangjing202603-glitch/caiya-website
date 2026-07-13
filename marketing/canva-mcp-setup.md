# Canva MCP 接入操作手册（财芽版）

> 项目：财芽 CaiYa
> 用途：把 Canva 设计能力接入 Claude Code，自动化小红书/公众号/朋友圈配图
> 适配环境：**先在泰国跑通**，回国内再处理国内访问问题
> 创建：2026-07-10 / **最后实测：2026-07-10（跑通读权限）**

---

## 🟢 实测最终状态（2026-07-10）

**Server 已在本地跑通 + 接入 Claude Code，但撞到 Canva 官方限制。**

| 能力 | 状态 | 说明 |
|:---|:---:|:---|
| 搜索/读取你的 Canva 设计（search / get / pages）| ✅ **已验证** | 真的能返回设计列表 + 缩略图 |
| 编辑现有设计（editing transactions）| ✅ 接口可用 | scope 已开，未实测 |
| 上传素材（upload-asset）| ✅ 接口可用 | scope 已开，未实测 |
| **AI 文字生图（generate-design）**| ❌ **Canva 不支持** | `/v1/designs/generate` 接口 404，Magic Design 没对开发者公开 |
| 模板填充生图（Autofill）| ⚠️ 需 Canva 付费版 + 自建品牌模板 | 公开 API 有，但 Free 版用不了 |

### 🎯 结论与推荐路径

- **Canva MCP 的真实价值**：搜索/读取/编辑**已有的** Canva 设计，**不能凭空 AI 生图**。
- **做小红书 10 张图的推荐方案**：**HTML + Playwright 截图**（免费、完全可控、不依赖 Canva 付费版）。详见文末「替代方案」。
- **Canva MCP 没白配**：以后做 Autofill（模板填充）时这套已就绪；这次踩的坑也值得记录。

---

## 📋 全局概览

```
申请 Canva 开发者账号 → 拿 Client ID/Secret
        ↓
克隆 MCP Server → 装依赖 → 配环境变量
        ↓
OAuth 登录 → 拿到 access_token
        ↓
注册到 Claude Code → 测试调用
        ↓
财芽场景实战（10 张图自动化）
```

**预计耗时**：Phase 1（1-3 天）→ Phase 2（3-5 天）→ Phase 3（2 周起）

---

## 🚀 Phase 1：本地试通（1-3 天）

### Day 1：申请 Canva 开发者账号（30-60 分钟）

**Step 1.1**：访问 Canva Developer Portal
- 网址：https://www.canva.com/developers/integrations/connect-api
- **用你的 Canva 个人账号登录**（静静在泰国能直接访问）

**Step 1.2**：创建 Integration
- 点击 "Create an integration"
- **Integration name**：`财芽 CaiYa 内容创作`（或自取）
- 配置 Scopes（**关键，必须勾选这些**）：
  - ✅ `asset:read`
  - ✅ `asset:write`
  - ✅ `design:meta:read`
  - ✅ `design:content:read`
  - ✅ `design:content:write`
  - ✅ `brandtemplate:meta:read`
  - ✅ `brandtemplate:content:read`
  - ✅ `profile:read`
- **Redirect URI**：暂时填 `http://localhost:8000/auth/callback`（后面可改）

**Step 1.3**：拿到凭据
- **Client ID**：复制保存到本地（建议放 1Password / Bitwarden）
- **Client Secret**：同上，**妥善保管不外传**

**⚠️ 注意**：
- 申请时 Canva 可能要求企业邮箱/审核——个人 Gmail 可能也行
- 如果申请被拒，备用方案：用 `canva.cn` 国内版（如有 API）

---

### Day 2：本地部署 MCP Server（1-2 小时）

**Step 2.1**：环境准备
```bash
# 检查 Node.js（需要 18+）
node -v   # 应 ≥ v18.0.0
npm -v    # 应 ≥ v9.0.0

# 如果没装：https://nodejs.org
```

**Step 2.2**：克隆仓库
```bash
cd F:\AI工具\AI财务网址搭建\marketing
git clone https://github.com/EmilyThaHuman/canva-mcp-server.git
cd canva-mcp-server
npm install
```

**Step 2.3**：配置环境变量
```bash
# 创建 .env 文件
copy .env.example .env
```

**编辑 .env**：
```bash
CANVA_CLIENT_ID=你的_Client_ID
CANVA_CLIENT_SECRET=你的_Client_Secret
REDIRECT_URI=http://localhost:8000/auth/callback
PORT=8000
```

**Step 2.4**：启动 MCP Server
```bash
npm start
```

**预期输出**：
```
🚀 Canva MCP Server running on http://localhost:8000
📝 Authorize at: http://localhost:8000/auth
```

**Step 2.5**：OAuth 登录
- 浏览器打开 `http://localhost:8000/auth`
- 跳转到 Canva 登录页（用你的 Canva 账号）
- 授权后回到 `http://localhost:8000/auth/callback`
- 看到 "✅ Authorization successful" 即成功
- **access_token 自动保存到本地**，无需手动复制

---

### Day 3：注册到 Claude Code（30 分钟）

**Step 3.1**：编辑 Claude Code 配置
```bash
# 配置文件位置：
# Windows: %APPDATA%\Claude\claude_desktop_config.json
# 或全局：~/.claude.json

# 用文本编辑器打开
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**Step 3.2**：添加 canva MCP server
```json
{
  "mcpServers": {
    "canva": {
      "command": "node",
      "args": ["F:/AI工具/AI财务网址搭建/marketing/canva-mcp-server/src/index.js"],
      "env": {
        "CANVA_CLIENT_ID": "你的_Client_ID",
        "CANVA_CLIENT_SECRET": "你的_Client_Secret",
        "REDIRECT_URI": "http://localhost:8000/auth/callback",
        "PORT": "8000"
      }
    }
  }
}
```

**Step 3.3**：重启 Claude Code
- 完全退出 Claude Code
- 重新打开
- 在新对话里输入 "列出 MCP 服务器" 应该看到 `canva`

---

## 🧪 Phase 1 测试：基础调用

### Test 1：列出我的设计
```
在 Claude Code 里输入：
"用 canva MCP 列出我最近的设计"
```

**预期**：返回 Canva 账号下的设计列表

### Test 2：搜索模板
```
"用 canva MCP 搜索关键词 '小红书 财务' 的模板"
```

**预期**：返回相关设计模板

### Test 3：生成设计
```
"用 canva MCP 帮我生成一张小红书封面，尺寸 1080x1080，主题是'做财务 5 年最想辞职的 10 个瞬间'，暖琥珀色 #F09A1A 渐变背景"
```

**预期**：生成 1 个 Canva 设计 URL

---

## 🎨 Phase 2：财芽场景实战（3-5 天）

### 目标
用 Canva MCP 把第 1 篇小红书《做财务 5 年，我最想辞职的 10 个瞬间》的 10 张图全部自动化生成。

### Step 2.1：批量生成（Day 4）
在 Claude Code 里一次提交 10 个生成请求：

```
用 canva MCP 按以下规格生成 10 张小红书图（每张 1080x1080）：

图 1（封面）：
- 主题：做财务 5 年
- 副标题：最想辞职的 10 个瞬间
- 角标：你中了几条？
- 配色：暖琥珀 #F09A1A 渐变 + 白字
- 字体：Noto Sans SC

图 2：月底结账，加班到凌晨 3 点
... (省略，详见 01_做财务5年_最想辞职的10个瞬间.md 的 10 张图设计稿)
```

### Step 2.2：导出为 PNG（Day 5）
**关键挑战**：Canva MCP 19 个工具里**没明确支持导出**。

**3 个备选导出方案**：

| 方案 | 操作 | 优点 | 缺点 |
|:-----|:-----|:-----|:-----|
| **A. Playwright 兜底** | 用 Playwright 打开 Canva 网页版 → 截图 | 一定成功 | 需要登录态保持 |
| **B. Canva 网页版手动导出** | 打开设计 → 下载 → PNG | 简单 | 不能自动化 |
| **C. Canva Connect API 直接调用** | 找官方 API 文档（导出参数）| 真正自动化 | 需要研究 |

**推荐 A**：Playwright + Canva 已登录浏览器 = 截图导出。

### Step 2.3：批量发布（Day 6-7）
- 10 张 PNG 准备好
- 上传到小红书（草稿模式）
- 评论区引导"扣财务"加 V
- 24h 后看数据

---

## 🚧 Phase 3：规模化（2 周起）

### 自动化工作流
```
新选题（每周 2-3 个）
    ↓
Claude Code 用 canva MCP 批量生成
    ↓
Playwright 截图导出
    ↓
自动发布到小红书/公众号
    ↓
数据回流到 caiyaai.com
    ↓
每周复盘
```

### 性能目标
- 单张图生成：5 分钟
- 10 张图批次：30-50 分钟
- 每周 3 篇笔记 × 10 张 = 30 张图/周

---

## ⚠️ 已知风险清单

| 风险 | 触发条件 | 应对 |
|:-----|:---------|:-----|
| **Canva 申请被拒** | 申请时用个人邮箱+无公司信息 | 备用：canva.cn 国内版（需验证是否有 API） |
| **OAuth 回调地址限制** | `localhost:8000` 在某些网络环境失败 | 用 ngrok/Cloudflare Tunnel 暴露公网回调 |
| **MCP Server 启动失败** | Node.js 版本低 / 依赖装不上 | 升级 Node.js 20 LTS / 用 Docker 跑 |
| **Generate 工具不稳定** | 提示词不明确 / Canva AI 不支持复杂需求 | 多次尝试 + 拆解提示词 + 备用稿定设计 |
| **导出功能缺失** | MCP 19 个工具不含导出 | Playwright 兜底 |
| **泰国网络不稳定** | 网络抖动导致 OAuth/上传失败 | 错峰操作 + 重试机制 |
| **国内访问阻塞**（未来回国）| Canva 主站国内慢 | 切换 canva.cn 或挂代理 |

---

## 🔧 调试速查

### 常见错误

**错误 1：`Cannot find module '@modelcontextprotocol/sdk'`**
```bash
# 解决：依赖未装全
cd canva-mcp-server
rm -rf node_modules
npm install
```

**错误 2：`401 Unauthorized`**
```
原因：access_token 过期
解决：重新访问 http://localhost:8000/auth 授权
```

**错误 3：`429 Rate Limit`**
```
原因：调用太频繁
解决：增加请求间隔 + 申请 Canva 提升配额
```

**错误 4：生成的设计是空白**
```
原因：提示词太简单，Canva AI 不理解
解决：补充详细规格（颜色 hex / 字号 / 布局描述）
```

---

## 🔧 实际接入发现（2026-07-10 真实踩坑记录）

> ⚠️ 这些是**代码层面的真相**，README 和 SETUP_GUIDE 里有多处错误，以本节为准。

### 坑 1：README 写的 env 变量名是错的
- ❌ README 写：`REDIRECT_URI=http://localhost:8000/auth/callback` + `PORT=8000`
- ✅ 代码实际（server.ts）：变量名是 **`CANVA_REDIRECT_URI`**，默认端口 **`8001`**
- 正确的 `.env`：
  ```
  CANVA_CLIENT_ID=...
  CANVA_CLIENT_SECRET=...
  CANVA_REDIRECT_URI=http://localhost:8001/auth/callback
  PORT=8001
  ```

### 坑 2：server.ts 没有 dotenv import，`.env` 不会被自动加载
- 直接 `npm run dev` 会用代码里的**默认值**（`http://0.0.0.0:8001/auth/callback`），导致 OAuth redirect_uri 不匹配
- **修复**：已改 `package.json` 的 dev/start 脚本加 `--env-file=.env`：
  - `"dev": "tsx --env-file=.env src/server/server.ts"`
  - `"start": "node --env-file=.env dist/server/server.js"`

### 坑 3：社区仓库有**无限递归栈溢出 bug**（致命）
- **现象**：任何 SSE 客户端断开连接 → server 崩溃（`RangeError: Maximum call stack size exceeded`）
- **根因**：`server.ts:1574` 的 `transport.onclose` 回调里调了 `await server.close()`，而 MCP SDK 的 `Server.close()` 会再次触发 `transport.onclose` → 无限递归
- **修复**：已删掉 `transport.onclose` 里的 `await server.close()`（transport 已在关，只需清自己的 session map）
- 修复后验证：3 次连接+断开 server 不崩

### 坑 4：这是个 SSE 传输的 server，不是 stdio
- SSE 端点：`GET http://localhost:8001/mcp`
- 消息端点：`POST http://localhost:8001/mcp/messages?sessionId=...`
- OAuth 回调：`GET http://localhost:8001/auth/callback`
- **Claude Code 接入用 URL 方式**（不是 command+args）：
  ```bash
  claude mcp add --transport sse -s user canva http://localhost:8001/mcp
  ```

### 坑 5：OAuth 是"按需触发"，不是"预先授权"
- server **没有独立的 `/auth` 入口**
- 流程：Claude Code 连 SSE → 调工具 → 未授权时工具返回 `Please authenticate: <URL>` → 用户浏览器打开该 URL → 授权 → token 存到对应 sessionId → 再调工具就通了
- **token 存内存**（重启 server 需重新授权）

### 坑 6：启动时需要 widget HTML
- `assets/` 根目录只有 `.js` 文件，但 server 启动时找 `canva-search-designs.html` 等 3 个 HTML
- **好在** `assets/src/components/` 下有这 3 个 HTML，server 的 fallback 路径能找到，不会崩（不用 `npm run build`）

### 坑 7：token 按 SSE session 存，Claude Code 每次新 session → 无限要授权（实测踩中）
- **现象**：授权成功后，再调一次 canva 工具又返回新授权 URL（state 变了），永远连不上
- **根因**：Claude Code 每次 tool 调用开**新的 SSE 连接**（新 `sessionId`），社区代码把 token 按 `sessionId` 存在 `authSessions` Map 里 → 新 session 查不到 token
- **修复**（改 server.ts 4 处）：
  1. 加全局变量 `let globalAuth = null`
  2. OAuth 回调 `handleAuthCallback` 里：`globalAuth = newSession`（除了按 session 存，也存全局）
  3. `getValidAccessToken` 里：`const session = authSessions.get(sessionId) ?? globalAuth`（兜底取全局）
  4. tool handler 鉴权判断：`if (authSessions.has(sessionId) || globalAuth)`
- **原理**：单用户场景不需要多 session 隔离，全局槽即可

### 坑 8：`invalid_scope` 是因为请求了 Integration 没启用的 scope（实测踩中）
- **现象**：授权页报 `Error: invalid_scope`
- **根因**：社区代码 hardcode 请求 10 个 scope，但用户的 Integration 只启用了其中一部分（`comment:*` / `folder:*` 没开）→ Canva 直接拒掉**整个请求**
- **修复**：只请求**实际需要的 + 确认已启用的** scope（当前 6 个：`design:meta:read` / `design:content:read` / `design:content:write` / `asset:read` / `asset:write` / `profile:read`）
- **教训**：OAuth `invalid_scope` 是"**只要有一个**没开就全拒"，不是"只拒没开的那个"

### 坑 9：`generate-design` 调的 `/v1/designs/generate` 接口根本不存在（致命限制）
- **现象**：调 generate-design → `404 endpoint_not_found POST /v1/designs/generate`
- **根因**：Canva 的 **Magic Design（AI 文字生图）是消费者功能，没对开发者公开**。社区代码这个工具是基于一个**不存在的接口**写的
- **Canva 公开 API 真实能力**：
  - ✅ 搜索/读取/编辑**已有的**设计
  - ✅ Autofill（模板填充）——但要 **Canva 付费版** + 自建品牌模板
  - ❌ AI 凭空生图（没有）
- **无法修复**，只能换方案（见文末「替代方案」）

---

## 🔧 运维：日常怎么用 / 怎么重启

### server 的"标准重启流程"（每次改代码或要重新授权时）

新开 PowerShell，粘 3 行：
```powershell
cd "F:\AI工具\AI财务网址搭建\marketing\canva-mcp-server"
Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
npm run dev
```
看到 `Canva MCP server listening on http://0.0.0.0:8001` 即启动成功。

### "服务器不重启" = PowerShell 窗口开着不关

token 存在内存里。只要跑 server 的那个 PowerShell 窗口**开着、进程在跑**，canva 调用就免授权。

**会丢 token（要重新授权）的情况**：
- 关闭 PowerShell 窗口 / Ctrl+C 停掉
- 电脑关机、重启、休眠后进程被杀
- 改了 server 代码必须重启

**不会丢 token 的情况**：
- 窗口一直开着、不用 canva 时也开着
- 笔记本合盖但不休眠

### 要不要做到"永远只授权一次"？

可以——把 token 存到硬盘文件（比如 `.token.json`），启动时读，授权后写。改 `server.ts` 的 `globalAuth` 读写逻辑即可。**当前没做**（内测够用），需要时再说。

---

## 🎯 当前 scope 配置（6 个，server.ts 里）

```ts
const scopes = [
  "design:meta:read",       // 搜索/列表
  "design:content:read",    // 读取设计内容
  "design:content:write",   // 编辑设计（generate-design 用不了，但 editing 能用）
  "asset:read",             // 读素材
  "asset:write",            // 上传素材
  "profile:read",           // 用户信息
];
```

**不要加回** `comment:*` / `folder:*`（用户 Integration 没开 → invalid_scope）。如果以后在 Canva 后台启用了，再加。

---

## 🚀 替代方案：HTML + Playwright 截图（做小红书图推荐）

既然 Canva 不能 AI 生图，做"财芽橙皮书"系列图片走这条路：

**流程**：
1. 写 10 个 HTML 文件（每个 1080×1080 正方形，暖琥珀 `#F09A1A` + 大字 + 卡片）
2. Playwright 自动打开每个 HTML → 截图存 PNG
3. 直接拿 10 张 PNG 发小红书

**好处**：
- 免费、完全可控（颜色/字体/布局全自己写）
- 改文字超快（改 HTML 重截，秒级）
- 风格统一（同一套 CSS）
- 不依赖 Canva 付费版

**配套**：第 1 篇 10 张图的文字设计稿已在 `marketing/小红书/财芽橙皮书/01_做财务5年_最想辞职的10个瞬间.md`，可直接据此写 HTML。

---

## 📚 配套资源

- **设计稿源文件**：`marketing/小红书/财芽橙皮书/01_做财务5年_最想辞职的10个瞬间.md`（10 张图文字设计稿）
- **Canva 官方文档**：https://www.canva.dev/docs/connect/
- **MCP 协议说明**：https://modelcontextprotocol.io/
- **Claude Code 文档**：https://docs.claude.com/en/docs/claude-code

---

## 📞 遇到问题怎么办

**Step 1**：看错误信息，匹配"调试速查"表
**Step 2**：看 MCP Server 日志（`npm start` 输出）
**Step 3**：看 Canva API 文档（https://www.canva.dev/docs/connect/）
**Step 4**：在 Claude Code 里问我，我会帮你诊断
**Step 5**：实在不行，**临时用稿定设计/HTML 兜底**——MCP 接入可以异步推进

---

## ✨ 完成后能做

1. ✅ 在 Claude Code 里直接说"用 Canva 生成 XX 图"
2. ✅ 批量生成 10 张/30 张图，每周省 10 小时
3. ✅ 设计风格统一（用同一个 Brand Template）
4. ✅ 财芽橙皮书系列规模化产出
5. ✅ 公众号/朋友圈/视频号封面同款风格

---

*创建：2026-07-10 / 配套：商业计划附录 H + 小红书第 1 篇 + W28 复盘*
*适配：先泰国跑通，回国再处理国内访问*