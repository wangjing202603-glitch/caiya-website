# API 设计规范

> 最后更新：2026-07-01 · 维护人：@工程负责人

## 1. 风格

- REST + JSON；阶段 2 后部分接口引入 tRPC
- 路径用复数名词：`/api/orders`、`/api/kb/articles`
- 动作用 HTTP method：GET/POST/PUT/PATCH/DELETE
- 不用 URL 携带版本（`/api/v1`）；版本用 `Accept` 头（极少使用）
- 全站 base path：`/api`

## 2. 命名

| 资源 | 路径 | 例 |
|---|---|---|
| 列表 | `GET /api/<resources>` | `GET /api/kb/articles` |
| 详情 | `GET /api/<resources>/:id` | `GET /api/orders/:id` |
| 创建 | `POST /api/<resources>` | `POST /api/orders` |
| 全量更新 | `PUT /api/<resources>/:id` | — |
| 部分更新 | `PATCH /api/<resources>/:id` | `PATCH /api/users/:id` |
| 删除 | `DELETE /api/<resources>/:id` | — |
| 子资源 | `/api/<a>/:id/<b>` | `POST /api/orders/:id/refund` |

动作型端点（不适合 REST）：

- `POST /api/payment/wxpay/create`（创建支付）
- `POST /api/ai/chat`（流式问答）
- `POST /api/auth/sign-in`

## 3. 请求与响应

### 3.1 请求

- `Content-Type: application/json`
- 时间字段：ISO 8601（`2026-07-15T08:30:00.000Z`）
- 金额：分（`integer`），避免浮点
- 分页：`?page=1&pageSize=20` 或 cursor 模式 `?cursor=<id>&limit=20`
- 排序：`?sort=-updatedAt,title`
- 过滤：`?status=paid&authorId=xxx`
- 字段筛选：`?fields=id,title,slug`

### 3.2 响应

成功：

```json
{
  "data": { ... },
  "meta": { "page": 1, "pageSize": 20, "total": 123 }
}
```

流式（SSE）：

```
data: {"type":"start"}
data: {"type":"delta","text":"你好"}
data: {"type":"sources","items":[...]}
data: {"type":"done"}
```

错误：

```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "订单不存在",
    "details": { "orderId": "xxx" },
    "traceId": "abc123"
  }
}
```

## 4. 错误码

| 范围 | 含义 |
|---|---|
| 400 | 请求参数错误 |
| 401 | 未登录 / Token 失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 冲突（重复 / 状态机不允许） |
| 422 | 业务规则校验失败 |
| 429 | 限流 |
| 500 | 服务器内部错误 |
| 502 / 503 / 504 | 上游/网关问题 |

业务错误码用 `SCREAMING_SNAKE_CASE`，例：

- `USER_NOT_FOUND`
- `ORDER_ALREADY_PAID`
- `PAYMENT_SIGN_INVALID`
- `AI_QUOTA_EXCEEDED`
- `KB_ARTICLE_NOT_PUBLIC`

完整列表放在 `lib/errors.ts`（阶段 1 实现）。

## 5. 幂等

- 所有 `POST` 接受 `Idempotency-Key: <uuid>` 头
- 服务端存 24 小时；同 key 重复请求直接返回首次结果
- 用于：创建订单、发起支付、提交评论

## 6. 限流

- IP 维度：每分钟 60 次（防爬虫）
- 用户维度：登录后 600 次 / 小时
- 业务维度：AI 问答按套餐配额（见 `AI-知识库重建索引.md`）
- 超限返回 `429` + `Retry-After` 头

## 7. 安全

- 所有写接口要求登录（除 webhook / 公开表单）
- 鉴权用 `Authorization: Bearer <token>`（Auth.js JWT）
- 越权检查放在 handler 内部（不依赖中间件）
- 详见 [`安全合规.md`](./安全合规.md)

## 8. 文档

- OpenAPI 3.1 描述文件：`/openapi.json`（阶段 1 后启用）
- 每个 handler 用 JSDoc 标 `@summary` `@param` `@returns`
- 关键流程在 `docs/05-flows/` 写序列图（Mermaid）

## 9. Webhook

- 微信 / 支付宝 webhook 走专用路由
- 验签在中间件层
- 验签失败返回 401 + 详细日志
- 重试由"内部任务队列"接管，详见 [`支付与对账.md`](./支付与对账.md)

## 10. 版本与兼容

- 字段新增：允许
- 字段删除 / 类型变化：写 ADR + 旧字段保留 6 个月
- 路径废弃：保留重定向 + `Sunset` 响应头

## 11. 速查

| 场景 | 规则 |
|---|---|
| 列表分页 | `?page=1&pageSize=20` |
| 模糊搜索 | `?q=xxx` + 后端 ES/PG |
| 大批量数据 | cursor + 限制 ≤ 100 |
| 长时间任务 | 返回 202 + 任务 ID + 轮询 |
| 流式响应 | SSE + `Content-Type: text/event-stream` |
