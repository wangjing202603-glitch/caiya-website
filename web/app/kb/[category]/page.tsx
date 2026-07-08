import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { KbSidebar } from "@/components/kb/kb-sidebar";
import { KbCard } from "@/components/kb/kb-card";
import {
  getKbIndex,
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/kb";

interface Params {
  params: { category: string };
}

export function generateStaticParams() {
  return getKbIndex().categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const c = getCategoryBySlug(params.category);
  if (!c) return { title: "未找到分类" };
  return {
    title: c.name,
    description: c.description,
  };
}

export default function CategoryPage({ params }: Params) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();
  const articles = getArticlesByCategory(params.category);
  const index = getKbIndex();

  return (
    <div className="container py-10 md:py-14 flex gap-8">
      <KbSidebar
        categories={index.categories}
        activeCategorySlug={category.slug}
      />
      <div className="flex-1 min-w-0">
        {/* 面包屑式返回 */}
        <Link
          href="/kb"
          className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          全部板块
        </Link>

        {/* Hero */}
        <div className="mt-3">
          <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
            Category · {category.id}
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-base text-ink-500 dark:text-ink-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* 子分类标签 */}
        {category.children.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {category.children.map((sub) => (
              <span
                key={sub.slug}
                id={sub.slug}
                className="rounded-md border border-ink-200 dark:border-ink-700 bg-card px-2.5 py-1 text-xs text-ink-600 dark:text-ink-300"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}

        {/* 文章数 */}
        <div className="mt-8 text-xs font-mono text-ink-500 tracking-wider uppercase">
          {articles.length} 篇内容
        </div>

        {articles.length === 0 ? (
          /* 空态：跟总览空板块呼应的大卡片 */
          <div className="mt-6 rounded-lg border border-dashed border-foreground/20 bg-card/50 p-12 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-ink-100 text-ink-400 dark:bg-ink-800">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">即将上线</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
              「{category.name}」板块正在筹备中。我们会按 P1 优先级填充，敬请期待。
            </p>
            <Link
              href="/kb"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline underline-offset-4"
            >
              先看看其他板块 <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <KbCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}