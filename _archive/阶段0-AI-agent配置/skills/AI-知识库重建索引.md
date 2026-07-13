# 技能：AI 知识库重建索引

> 适用：工程负责人 + AI 负责人
> 目标：把 KB 内容正确地切块、向量化、写入 pgvector，召回质量稳定可评。

## 1. 触发场景

- 首次上线 AI 问答
- 新增 ≥ 10 篇文章
- 内容大量改写（如政策更新）
- Embedding 模型更换
- 召回率评估下降

## 2. 前置

- pgvector 扩展已启用
- Embedding 凭据已配
- 评估 query 集 ≥ 30 条

## 3. 流程

### 3.1 抓取

1. 读 `content/kb/**/index.mdx`
2. 解析 Frontmatter，过滤 `status: published`
3. 正文提取（去 Frontmatter / 去代码块中的示例命令可保留）

### 3.2 切块（Chunking）

策略：

- 段落级优先（保持语义完整）
- 长度上限：每块 ≤ 800 token，重叠 100 token
- 标题、列表项整体作为一段
- 代码块单独切分（避免破坏）
- 表格单独切分

工具建议：

- `langchain/text-splitter`（RecursiveCharacterTextSplitter）
- 自研：基于 markdown 结构（# ## ###）做递归切

### 3.3 元数据

每块带：

```ts
{
  articleId: string
  chunkIndex: number
  content: string
  category: string
  tags: string[]
  access: 'public' | 'member' | 'pro'
  updatedAt: Date
  hash: string  // 用于去重
}
```

### 3.4 向量化

```ts
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: chunk.content
})
```

- 批处理：每批 ≤ 64 块
- 限流：3 次/秒（防供应商熔断）
- 失败重试：3 次，指数退避

### 3.5 写库

```ts
await prisma.$executeRaw`
  INSERT INTO kb_article_embeddings (id, article_id, chunk_index, content, embedding, metadata, created_at)
  VALUES (${cuid}, ${articleId}, ${i}, ${content}, ${vector}::vector, ${jsonb}, now())
`
```

- 写库前先清旧数据（按 article_id）
- 启用 HNSW 索引（先小批量建 → 评估 → 再大表）
- 写库完成 → 标记 `kb_articles.embedded_at = now()`

### 3.6 评估

query 集（≥ 30 条）：

- 真实用户 query（如有日志，提取 top 50）
- SME 构造 query（覆盖各类政策 / 工具）
- 难度梯度：易 / 中 / 难

评估指标：

- **Recall@5** ≥ 0.8
- **MRR** ≥ 0.7
- **人工抽检**：前 5 条命中的相关性 ≥ 80%

跑 `pnpm eval:ai`，结果存 `docs/04-ops/ai-eval/<date>.md`。

### 3.7 上线

1. 双跑：新旧索引 → 用 query 抽样对比
2. 切流：环境变量 `EMBED_TABLE` 指向新表
3. 监控：命中率、延迟、首字 token 时间
4. 7 天后清理旧索引

### 3.8 重建成本

- 1000 块 ≈ $0.02（OpenAI text-embedding-3-small）
- 1000 块向量化时间：~30s（OpenAI）/ ~5min（自托管）
- 写入 PG：~2min

## 4. 验收

- [ ] 重建任务幂等
- [ ] 评估 query 集 ≥ 0.8 recall
- [ ] 索引可查
- [ ] AI 问答引用正确
- [ ] 监控告警就位

## 5. 反模式

- ❌ 整篇文章作为一个块（向量稀释）
- ❌ 切块时破坏代码 / 表格
- ❌ 不评估就上线
- ❌ Embedding 模型频繁切换
- ❌ 把会员内容向量化但前端没做权限过滤

## 6. 速查

| 任务 | 文件 / 工具 |
|---|---|
| 抓取 | `lib/ai/ingest.ts` |
| 切块 | `lib/ai/chunker.ts` |
| 向量化 | `lib/ai/embed.ts` |
| 评估 | `tests/ai-eval/` |
| 任务 | `scripts/embed-rebuild.mjs` |
| 监控 | Sentry + 自建指标 |
