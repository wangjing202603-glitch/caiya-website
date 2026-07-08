import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/kb";

export function KbCard({ article }: { article: Article }) {
  const isMember = article.access !== "public";
  return (
    <Link
      href={`/kb/${article.categorySlug}/${article.slug}`}
      className="group relative block rounded-md border border-foreground/10 bg-card px-4 py-3 pl-5 hover:border-brand-400 hover:shadow-sm transition overflow-hidden"
    >
      {/* 左侧暖橙竖条 */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1 bg-brand-500/0 group-hover:bg-brand-500 transition"
      />
      <div className="flex items-baseline gap-2 text-xs text-ink-500">
        <span className="font-mono text-xs">{article.categoryId}</span>
        <span>·</span>
        <span>{article.categoryName}</span>
        {isMember && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 text-[10px]">
            <Lock className="h-2.5 w-2.5" />
            {article.access === "pro" ? "Pro" : "会员"}
          </span>
        )}
      </div>
      <h3 className="mt-1.5 text-base font-semibold leading-snug group-hover:text-brand-600 transition">
        {article.title}
      </h3>
      <p className="mt-1 text-[13px] text-ink-500 line-clamp-2 leading-relaxed">
        {article.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
        <span className="line-clamp-1">
          {article.tags?.slice(0, 2).join(" · ")}
        </span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
      </div>
    </Link>
  );
}