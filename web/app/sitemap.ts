import type { MetadataRoute } from "next";
import { getKbIndex, getArticlesByCategory } from "@/lib/kb";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aicaiwu.cn";
  const now = new Date();

  // 静态页
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/kb`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 知识库分类页 + 文章页
  const kbPages: MetadataRoute.Sitemap = [];
  for (const c of getKbIndex().categories) {
    kbPages.push({
      url: `${base}/kb/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const a of getArticlesByCategory(c.slug)) {
      kbPages.push({
        url: `${base}/kb/${c.slug}/${a.slug}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...kbPages];
}
