"use strict";
/**
 * 知识库内容前置检查
 *   node scripts/check-content.cjs
 * 检查项：
 *  1. Frontmatter 必填字段
 *  2. YAML 能正确解析
 *  3. category 在 _index.json 中存在
 *  4. title ≤ 30 字 / description ≤ 120 字
 *  5. 缺失作者 / SME 警告
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const matter = require(path.join(ROOT, "web", "node_modules", "gray-matter"));
const CONTENT_DIR = path.join(ROOT, "web", "content", "kb");
const INDEX = path.join(CONTENT_DIR, "_index.json");

const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
// 兼容写法：slug / name / id / "id-name" 拼接（与 kb.ts 解析逻辑一致）
const cats = new Set();
for (const c of index.categories) {
  cats.add(c.slug);
  cats.add(c.name);
  cats.add(c.id);
  cats.add(`${c.id}-${c.name}`);
}

function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(f);
    else if (e.name.endsWith(".mdx")) yield f;
  }
}

let ok = 0, warn = 0, err = 0;
for (const f of walk(CONTENT_DIR)) {
  const raw = fs.readFileSync(f, "utf8");
  let parsed;
  try { parsed = matter(raw); }
  catch (e) {
    console.error("[ERR ]", path.relative(ROOT, f), "-", e.message.split("\n")[0]);
    err++;
    continue;
  }
  const fm = parsed.data || {};
  const rel = path.relative(ROOT, f);
  const issues = [];
  if (!fm.title) issues.push("missing title");
  if (!fm.slug) issues.push("missing slug");
  if (!fm.category) issues.push("missing category");
  else if (!cats.has(fm.category))
    issues.push("unknown category: " + fm.category);
  if (!fm.author) issues.push("missing author");
  if (!Array.isArray(fm.reviewers) || fm.reviewers.length === 0)
    issues.push("missing reviewers");
  if (typeof fm.title === "string" && [...fm.title].length > 30)
    issues.push("title > 30");
  if (typeof fm.description === "string" && [...fm.description].length > 120)
    issues.push("description > 120");
  if (issues.length === 0) {
    ok++;
  } else {
    console.warn("[WARN]", rel, "-", issues.join("; "));
    warn++;
  }
}
console.log(`\nResult: ${ok} ok, ${warn} warn, ${err} err`);
process.exit(err > 0 ? 1 : 0);