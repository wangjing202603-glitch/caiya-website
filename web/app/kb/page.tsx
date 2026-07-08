import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Compass,
  FolderKanban,
  Globe,
  ReceiptText,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { KbCard } from "@/components/kb/kb-card";
import { SearchBar } from "@/components/kb/search-bar";
import { getCategoryStats, getRecentArticles } from "@/lib/kb";
import type { Category } from "@/lib/kb";

export const metadata: Metadata = {
  title: "AI 财务知识库",
  description: "按财务主题浏览：税务、账务报表、成本、资金往来、AI 工具、出海财务、案例模板。",
};

// 8 板块图标映射
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "ru-men-zhi-nan": Compass,
  "shuiwu-shicao": ReceiptText,
  "zhangwu-yu-baobiao": BookOpen,
  "chengben-yu-yusuan": Calculator,
  "zijin-yu-wanglai": Wallet,
  "ai-gongju-yu-fangfa": Sparkles,
  "chuhai-thaiguo": Globe,
  "anli-yu-moban": FolderKanban,
};

export default function KbOverviewPage() {
  const stats = getCategoryStats();
  const recent = getRecentArticles(6);

  return (
    <div className="container py-12 md:py-16">
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
          Knowledge Base
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
          AI 财务知识库
        </h1>
        <p className="mt-3 text-base text-ink-500 dark:text-ink-400 leading-relaxed">
          按{" "}
          <strong className="font-semibold text-ink-700 dark:text-ink-200">
            财务主题
          </strong>
          浏览——税务、账务报表、成本、资金往来、AI 工具、出海财务、案例模板。每篇都由财务 / 税务专家交叉审阅，政策可溯源。
        </p>
      </div>

      <div className="mt-6 max-w-2xl">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* 8 板块卡片网格 */}
      <section className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
              Categories
            </div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              {stats.length} 大板块 · 全场景覆盖
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((c) => (
            <BoardCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* 最近更新 */}
      <section className="mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
              Recent
            </div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              最近更新
            </h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((a) => (
            <KbCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────── 板块卡片（空板块用 div 不可点，有文章用 Link）───────── */
function BoardCard({ c }: { c: Category & { count: number } }) {
  const Icon = CATEGORY_ICONS[c.slug] ?? BookOpen;
  const empty = c.count === 0;
  const className =
    "group relative rounded-lg border bg-card p-5 transition-all " +
    (empty
      ? "border-dashed border-foreground/15 opacity-70"
      : "border-foreground/10 hover:border-brand-400 hover:shadow-glow hover:-translate-y-1");

  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div
          className={
            "inline-flex h-10 w-10 items-center justify-center rounded-lg " +
            (empty
              ? "bg-ink-100 text-ink-400 dark:bg-ink-800"
              : "bg-brand-500/10 text-brand-600 dark:text-brand-400")
          }
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-mono text-ink-500">{c.id}</span>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{c.name}</h3>
      <p className="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2">
        {c.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs">
        {empty ? (
          <span className="text-ink-400">即将上线</span>
        ) : (
          <>
            <span className="text-ink-500">{c.count} 篇内容</span>
            <span className="inline-flex items-center gap-1 text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition">
              进入 <ArrowRight className="h-3 w-3" />
            </span>
          </>
        )}
      </div>
    </>
  );

  if (empty) return <div className={className}>{inner}</div>;
  return (
    <Link href={`/kb/${c.slug}`} className={className}>
      {inner}
    </Link>
  );
}