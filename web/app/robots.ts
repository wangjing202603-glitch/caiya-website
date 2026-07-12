import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caiyaai.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 不收录搜索/AI 问答（避免重复内容 + 动态参数）
        disallow: ["/kb/search", "/api/", "/auth/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
