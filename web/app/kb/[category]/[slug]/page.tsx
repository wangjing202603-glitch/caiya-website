import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, User, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { KbSidebar } from "@/components/kb/kb-sidebar";
import { KbToc } from "@/components/kb/kb-toc";
import { KbBreadcrumb } from "@/components/kb/kb-breadcrumb";
import { MemberGate } from "@/components/kb/invite-unlock";
import { Callout } from "@/components/kb/callout";
import {
  getArticle,
  getArticlesByCategory,
  getKbIndex,
} from "@/lib/kb";
import { renderMdx, extractHeadings } from "@/lib/mdx";
import { KbCard } from "@/components/kb/kb-card";

interface Params {
  params: { category: string; slug: string };
}

export function generateStaticParams() {
  const index = getKbIndex();
  return index.categories.flatMap((c) =>
    getArticlesByCategory(c.slug).map((a) => ({
      category: c.slug,
      slug: a.slug,
    })),
  );
}

export function generateMetadata({ params }: Params): Metadata {
  const article = getArticle(params.category, params.slug);
  if (!article) return { title: "未找到文章" };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      modifiedTime: new Date(article.updatedAt).toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const article = getArticle(params.category, params.slug);
  if (!article) notFound();

  const index = getKbIndex();
  const category = index.categories.find((c) => c.slug === params.category);
  const headings = extractHeadings(article.content);
  const related = getArticlesByCategory(params.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);
  const isMember = article.access !== "public";
  const mdx = await renderMdx(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    inLanguage: "zh-CN",
    isAccessibleForFree: article.access === "public",
  };

  return (
    <div className="container py-10 md:py-14 flex gap-10">
      <KbSidebar
        categories={index.categories}
        activeCategorySlug={params.category}
        activeSlug={params.slug}
      />
      <article className="flex-1 min-w-0 max-w-prose">
        <KbBreadcrumb
          items={[
            { label: "首页", href: "/" },
            { label: "知识库", href: "/kb" },
            {
              label: category?.name ?? "",
              href: category ? `/kb/${category.slug}` : undefined,
            },
            { label: article.title },
          ]}
        />

        {/* eyebrow：分类 + 核验日期 */}
        <div className="mt-4 flex items-center gap-3 text-xs">
          <span className="font-mono tracking-widest text-brand-600 uppercase">
            {category?.id} · {category?.name}
          </span>
          {isMember && (
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 font-medium">
              {article.access === "pro" ? "Pro" : "会员内容"}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-ink-500 dark:text-ink-400 leading-relaxed">
          {article.description}
        </p>

        {/* 元信息卡片化 */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600 dark:text-ink-300 border border-foreground/10 rounded-lg bg-card px-4 py-3">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-brand-600" /> {article.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            复核 {article.reviewers.join("、")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-600" /> {article.readingMinutes} 分钟
          </span>
          <span className="ml-auto text-ink-500">
            核验 {article.verifiedAt} · v{article.version}
          </span>
        </div>

        {article.callout && (
          <Callout type={article.callout.type} title={article.callout.title}>
            {article.callout.body}
          </Callout>
        )}

        {/* member 文章：正文用 MemberGate 包裹（邀请码解锁）；public 文章：直接渲染 */}
        {isMember ? (
          <MemberGate>
            <div className="prose-kb mt-6">{mdx}</div>
          </MemberGate>
        ) : (
          <div className="prose-kb mt-6">{mdx}</div>
        )}

        {/* 涉税免责声明（CFO 风控：涉税类自动加）*/}
        {category?.slug === "shuiwu-shicao" && <TaxDisclaimer />}

        {/* 免费文付费钩子（CFO：免费→付费转化路径）*/}
        {article.access === "public" && <MemberCta categoryName={category?.name} />}

        <Feedback slug={article.slug} />

        {related.length > 0 && (
          <section className="mt-16">
            <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
              Related
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight mb-5">
              相关推荐
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {related.map((a) => (
                <KbCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* 返回板块 */}
        <div className="mt-12 border-t border-foreground/10 pt-6">
          <Link
            href={category ? `/kb/${category.slug}` : "/kb"}
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回「{category?.name}」板块
          </Link>
        </div>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </article>
      <KbToc headings={headings} />
    </div>
  );
}

function Feedback({ slug: _slug }: { slug: string }) {
  return (
    <div className="not-prose mt-12 rounded-lg border border-foreground/10 bg-card p-5 text-sm">
      <div className="text-ink-700 dark:text-ink-200 font-medium">
        这篇文章对你有帮助吗？
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background px-3 py-1.5 hover:border-brand-400 hover:text-brand-600 transition"
        >
          👍 有帮助
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background px-3 py-1.5 hover:border-brand-400 hover:text-brand-600 transition"
        >
          👎 没解决
        </button>
        <a
          href="mailto:hi@aicaiwu.cn?subject=文章报错"
          className="inline-flex items-center gap-1.5 rounded-md border border-brand-300 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-3 py-1.5 hover:border-brand-500 transition"
        >
          ⚠️ 发现错误
        </a>
        <a
          href="mailto:hi@aicaiwu.cn?subject=文章反馈"
          className="ml-auto inline-flex items-center gap-1.5 text-ink-500 hover:text-brand-600 transition"
        >
          详细反馈 <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

/* 涉税免责声明（CFO 风控：涉税类文章固定加）*/
function TaxDisclaimer() {
  return (
    <div className="not-prose mt-10 rounded-lg border-l-2 border-brand-400 bg-brand-50/50 dark:bg-brand-900/10 px-5 py-4 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
      <strong className="font-semibold text-ink-800 dark:text-ink-100">
        免责声明
      </strong>
      ：本文为知识分享，不构成税务或法律建议。税收政策因地、因时、因企业情况而异，
      具体操作请结合你公司实际情况，并咨询持证税务师或主管税务机关。据此操作风险自负。
    </div>
  );
}

/* 免费文付费钩子（CFO：免费→付费转化路径）*/
function MemberCta({ categoryName }: { categoryName?: string }) {
  return (
    <div className="not-prose mt-10 rounded-lg border border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-ink-900 p-6">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">
            这是入门内容。完整的工具、模板与深度复盘在会员区。
          </h3>
          <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            会员含 7 个实战工具交付包（出纳流水 / 付款回单 OCR / 销售大表 / 进口台账…）
            + 可下载 Excel 模板与 Python 脚本 + AI 问答。¥299/年起。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-600 transition"
            >
              了解会员方案 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/kb/anli-yu-moban"
              className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 px-4 py-2 text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition"
            >
              看看案例与模板
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}