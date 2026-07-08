#!/usr/bin/env node
/**
 * 重建向量索引：阶段 3 启用。
 * 当前为占位说明。
 *
 * 流程：
 * 1. 读 content/kb/**/*.mdx
 * 2. 解析 Frontmatter + 正文
 * 3. 切块（chunk 800 token，重叠 100）
 * 4. 调用 Embedding API（OpenAI 兼容）
 * 5. 写入 KbArticleEmbedding（pgvector）
 * 6. 跑评估 query 集（recall@5 ≥ 0.8）
 */
console.log("embed-rebuild 阶段 3 启用，当前为占位")
