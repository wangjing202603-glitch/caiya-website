import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface CrumbItem {
  label: string;
  href?: string;
}

export function KbBreadcrumb({ items }: { items: CrumbItem[] }) {
  return (
    <nav aria-label="面包屑" className="text-sm text-ink-500 dark:text-ink-400 mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-600 transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink-800 dark:text-ink-100">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-ink-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
