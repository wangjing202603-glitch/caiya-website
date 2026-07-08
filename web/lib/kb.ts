import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "kb");
const INDEX_FILE = path.join(CONTENT_DIR, "_index.json");

/* ---------- 类型 ---------- */

export type Access = "public" | "member" | "pro";

export interface Category {
  id: string;          // "00"
  slug: string;        // "ru-men-zhi-nan"
  name: string;        // "入门指南"
  description: string;
  order: number;
  children: { slug: string; name: string }[];
}

export interface KbIndex {
  version: number;
  generatedAt: string;
  categories: Category[];
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;        // 推荐写分类 slug，如 "ru-men-zhi-nan"；兼容 id "00" / name "入门指南" / "00-入门指南"
  tags: string[];
  author: string;
  reviewers: string[];
  status: "draft" | "review" | "published" | "archived";
  access: Access;
  order: number;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string;
  version: number;
  featured?: boolean;      // 首页精选优先返回
  source?: string;         // 素材来源标注（如「公众号 #15」「出纳工具复盘」）
  callout?: { type: "info" | "warning" | "danger" | "success"; title: string; body: string };
}

export interface Article extends ArticleFrontmatter {
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  content: string;          // 原始 MDX 正文
  filePath: string;         // 相对 web/content/kb
  readingMinutes: number;
}

/* ---------- 索引 ---------- */

let _index: KbIndex | null = null;
export function getKbIndex(): KbIndex {
  if (_index) return _index;
  const raw = fs.readFileSync(INDEX_FILE, "utf8");
  _index = JSON.parse(raw) as KbIndex;
  return _index;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getKbIndex().categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return getKbIndex().categories.find((c) => c.id === id);
}

/* ---------- 文章 ---------- */

function* walkMdx(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMdx(full);
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      yield full;
    }
  }
}

let _articles: Article[] | null = null;
function loadAllArticles(): Article[] {
  if (_articles) return _articles;
  const index = getKbIndex();
  const catBySlug = new Map(index.categories.map((c) => [c.slug, c]));
  const catByName = new Map(index.categories.map((c) => [c.name, c]));
  const catById = new Map(index.categories.map((c) => [c.id, c]));

  const list: Article[] = [];
  for (const file of walkMdx(CONTENT_DIR)) {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data as Partial<ArticleFrontmatter>;
    if (!fm.title || !fm.slug) continue;
    if (fm.status === "archived" || fm.status === "draft") continue;

    // 解析 category：优先 slug，兼容 name / id / "id-name" 拼接
    let cat: Category | undefined;
    const c = (fm.category ?? "").trim();
    if (catBySlug.has(c)) {
      cat = catBySlug.get(c);
    } else if (catByName.has(c)) {
      cat = catByName.get(c);
    } else if (catById.has(c)) {
      cat = catById.get(c);
    } else if (catBySlug.has(c.replace(/^\d+-/, ""))) {
      // "00-入门指南" → 去掉 "00-" 前缀尝试 slug 匹配（旧 demo 格式兜底）
      cat = catBySlug.get(c.replace(/^\d+-/, ""));
    } else {
      cat = index.categories[0];
    }
    if (!cat) continue;

    const wordCount = parsed.content.replace(/\s+/g, "").length;
    const readingMinutes = Math.max(1, Math.round(wordCount / 400));

    // 把 YAML 解析出的 Date 对象统一转成 YYYY-MM-DD 字符串
    const dateKeys = ["createdAt", "updatedAt", "verifiedAt"] as const;
    for (const k of dateKeys) {
      const v = (fm as Record<string, unknown>)[k];
      if (v instanceof Date) {
        (fm as Record<string, unknown>)[k] = v.toISOString().slice(0, 10);
      } else if (typeof v === "string" && v.length > 10) {
        (fm as Record<string, unknown>)[k] = v.slice(0, 10);
      }
    }
    list.push({
      ...(fm as ArticleFrontmatter),
      categoryId: cat.id,
      categorySlug: cat.slug,
      categoryName: cat.name,
      content: parsed.content,
      filePath: path.relative(CONTENT_DIR, file).replace(/\\/g, "/"),
      readingMinutes,
    });
  }

  // 排序：分类 order + 文章 order + updatedAt
  list.sort((a, b) => {
    if (a.categoryId !== b.categoryId) {
      return Number(a.categoryId) - Number(b.categoryId);
    }
    if (a.order !== b.order) return a.order - b.order;
    return a.updatedAt < b.updatedAt ? 1 : -1;
  });

  _articles = list;
  return list;
}

export function getAllArticles(): Article[] {
  return loadAllArticles();
}

export function getPublishedArticles(): Article[] {
  return loadAllArticles().filter((a) => a.status === "published");
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return loadAllArticles().filter((a) => a.categorySlug === categorySlug);
}

export function getArticle(
  categorySlug: string,
  slug: string,
): Article | undefined {
  return loadAllArticles().find(
    (a) => a.categorySlug === categorySlug && a.slug === slug,
  );
}

export function getRecentArticles(limit = 10): Article[] {
  return [...loadAllArticles()]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
}

/**
 * 精选文章：优先返回 frontmatter 标了 `featured: true` 的公开文章；
 * 不够时 fallback 到「最近更新 + 公开访问」。
 */
export function getFeaturedArticles(limit = 6): Article[] {
  const recent = getRecentArticles(100).filter((a) => a.access === "public");
  const featured = recent.filter((a) => a.featured === true);
  const pool = featured.length >= limit ? featured : recent;
  return pool.slice(0, limit);
}

export function searchArticles(query: string, limit = 20): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return loadAllArticles()
    .filter((a) => {
      const hay = [
        a.title,
        a.description,
        ...(a.tags ?? []),
        a.content.slice(0, 600),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .slice(0, limit);
}

/* ---------- 辅助：分类下的子分类 ---------- */

export function getCategoryStats() {
  const articles = loadAllArticles();
  const index = getKbIndex();
  return index.categories.map((c) => ({
    ...c,
    count: articles.filter((a) => a.categoryId === c.id).length,
  }));
}
