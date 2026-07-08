"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import * as React from "react";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/kb", label: "知识库" },
  { href: "/pricing", label: "定价" },
  { href: "/about", label: "社群" },
];

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 dark:border-ink-800 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          <Image
            src="/logo/favicon-32.png"
            alt="财芽"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="tracking-tight">财芽</span>
          <span className="hidden sm:inline text-[11px] font-normal text-ink-400 tracking-wide">
            CaiYa
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-ink-600 hover:text-ink-900 hover:bg-ink-100 dark:text-ink-300 dark:hover:text-ink-50 dark:hover:bg-ink-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/kb/search"
            aria-label="搜索"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
