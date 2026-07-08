"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "search" | "ai";

export function SearchBar({ defaultQuery = "", className }: { defaultQuery?: string; className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialMode = (params.get("mode") === "ai" ? "ai" : "search") as Mode;
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [q, setQ] = React.useState(defaultQuery);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 快捷键 ⌘K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    qs.set("mode", mode);
    router.push(`/kb/search?${qs.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex items-stretch gap-1 rounded-lg border border-ink-200 dark:border-ink-800 bg-card p-1",
        className,
      )}
    >
      <div className="flex">
        {(["search", "ai"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition",
              mode === m
                ? "bg-brand-500 text-white"
                : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
            )}
          >
            {m === "search" ? (
              <>
                <Search className="h-3.5 w-3.5" /> 搜索
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> 问 AI
              </>
            )}
          </button>
        ))}
      </div>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={mode === "ai" ? "用中文问个财务问题…" : "搜索知识库…"}
        className="flex-1 bg-transparent px-3 text-sm placeholder:text-ink-400 focus:outline-none"
        aria-label={mode === "ai" ? "AI 问答输入" : "搜索输入"}
      />
      <button
        type="submit"
        className="rounded-md bg-ink-900 dark:bg-ink-50 dark:text-ink-900 text-ink-50 px-4 py-1.5 text-sm hover:opacity-90 transition"
      >
        {mode === "ai" ? "提问" : "搜索"}
      </button>
    </form>
  );
}
