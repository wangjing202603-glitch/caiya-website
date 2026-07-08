import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Category } from "@/lib/kb";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  activeCategorySlug?: string;
  activeSlug?: string;
}

export function KbSidebar({ categories, activeCategorySlug }: Props) {
  return (
    <nav
      aria-label="知识库分类"
      className="sticky top-20 hidden lg:block w-56 shrink-0 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 text-sm"
    >
      <div className="flex items-center gap-2 mb-4 text-ink-500">
        <BookOpen className="h-3.5 w-3.5" />
        <span className="font-mono text-[11px] uppercase tracking-wider">
          知识库
        </span>
      </div>
      <ul className="space-y-0.5 border-l border-foreground/10">
        {categories.map((c) => {
          const isActive = c.slug === activeCategorySlug;
          return (
            <li key={c.id}>
              <Link
                href={`/kb/${c.slug}`}
                className={cn(
                  "-ml-px flex items-center gap-2 border-l pl-3 py-1.5 transition",
                  isActive
                    ? "border-brand-500 text-foreground font-medium"
                    : "border-transparent text-ink-500 hover:text-foreground",
                )}
              >
                <span className="font-mono text-[11px] text-ink-400 w-5">
                  {c.id}
                </span>
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}