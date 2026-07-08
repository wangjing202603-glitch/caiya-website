import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/kb/search-bar";
import { KbCard } from "@/components/kb/kb-card";
import { searchArticles, getAllArticles } from "@/lib/kb";
import { Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "搜索 / AI 问答",
  description: "在知识库中搜索，或用 AI 直接提问。",
};

interface Props {
  searchParams: { q?: string; mode?: string };
}

export default function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();
  const mode = searchParams.mode === "ai" ? "ai" : "search";

  return (
    <div className="container py-10 md:py-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">
        {mode === "ai" ? "AI 财务问答" : "搜索知识库"}
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        {mode === "ai"
          ? "用中文提问，AI 会基于知识库回答并附引用来源。"
          : "支持标题、标签、正文片段的全文匹配。"}
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <SearchBar defaultQuery={q} />
        </Suspense>
      </div>

      <div className="mt-10">
        {q.length === 0 ? (
          <RecentArticles />
        ) : mode === "ai" ? (
          <AiAnswer q={q} />
        ) : (
          <SearchResults q={q} />
        )}
      </div>
    </div>
  );
}

function RecentArticles() {
  const recent = getAllArticles().slice(0, 8);
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">热门文章</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {recent.map((a) => (
          <KbCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}

function SearchResults({ q }: { q: string }) {
  const results = searchArticles(q, 30);
  return (
    <section>
      <div className="text-sm text-ink-500">
        找到 <strong className="text-ink-900 dark:text-ink-50">{results.length}</strong> 条与「{q}」相关的文章
      </div>
      {results.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-ink-200 dark:border-ink-800 p-10 text-center text-ink-500">
          没找到匹配的文章。试试
          <Link href={`/kb/search?q=${encodeURIComponent(q)}&mode=ai`} className="text-brand-600 mx-1 underline">
            问 AI
          </Link>
          ？
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {results.map((a) => (
            <KbCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}

function AiAnswer({ q }: { q: string }) {
  const results = searchArticles(q, 5);
  // 阶段 1 占位：直接展示"找到的来源"，提示用户阶段 3 启用真实 AI。
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-ink-900 p-6">
        <div className="flex items-center gap-2 text-sm text-brand-700 dark:text-brand-300">
          <Sparkles className="h-4 w-4" />
          AI 回答（预览）
        </div>
        <p className="mt-3 text-ink-800 dark:text-ink-100 leading-relaxed">
          阶段 1 的搜索页是占位实现。完整的 RAG 问答在阶段 3 启用：
          召回 → 拼上下文 → 流式输出 + 引用卡片。
          现在我们先帮你找到知识库里最相关的 {results.length} 篇：
        </p>
        <p className="mt-2 text-sm text-ink-500">
          你问的是：<span className="font-mono">「{q}」</span>
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-ink-500" />
          引用来源
        </h3>
        {results.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-200 dark:border-ink-800 p-8 text-center text-ink-500">
            知识库里没找到相关内容。换个说法试试？
          </div>
        ) : (
          <ul className="space-y-3">
            {results.map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/kb/${a.categorySlug}/${a.slug}`}
                  className="block rounded-lg border border-ink-200/60 dark:border-ink-800 bg-card p-4 hover:border-brand-300"
                >
                  <div className="text-xs text-ink-400 font-mono">
                    [{i + 1}] {a.categoryName}
                  </div>
                  <div className="text-base font-semibold mt-1">
                    {a.title}
                  </div>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400 line-clamp-2">
                    {a.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}