"use client";

import * as React from "react";
import type { Heading } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export function KbToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = React.useState<string | null>(headings[0]?.slug ?? null);

  React.useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="文章目录" className="sticky top-20 hidden xl:block w-56 shrink-0 self-start pl-2 text-sm">
      <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">
        目录
      </div>
      <ul className="space-y-1.5 border-l border-ink-200 dark:border-ink-800">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              className={cn(
                "-ml-px block border-l pl-3 transition",
                h.depth === 3 ? "pl-6" : "pl-3",
                active === h.slug
                  ? "border-brand-500 text-brand-700 dark:text-brand-300"
                  : "border-transparent text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
