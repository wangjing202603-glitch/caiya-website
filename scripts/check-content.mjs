#!/usr/bin/env node
/**
 * 内容 lint：阶段 1 启用。
 * 当前为占位说明。
 *
 * 检查项（计划）：
 * 1. Frontmatter 完整性
 * 2. 内部链接可达
 * 3. 图片 / 附件存在
 * 4. 标题层级
 * 5. 关键词（避税 / 包过 / 稳赚 等）
 * 6. 引文出处
 * 7. verifiedAt 超期警告（> 30 天）
 */
import { readFileSync } from "node:fs"
import { join, relative } from "node:path"

const CONTENT_DIR = "content/kb"

function walk(dir) {
  // TODO: 递归遍历 content/kb/**/*.mdx
  return []
}

const files = walk(CONTENT_DIR)
console.log(`扫描到 ${files.length} 篇 KB 文章（占位实现）`)
console.log("阶段 1 前请勿依赖此脚本")
