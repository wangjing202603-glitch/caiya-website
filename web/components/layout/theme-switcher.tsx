"use client";

import * as React from "react";
import { useTheme } from "@/components/layout/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 主题切换器：只支持「亮 / 暗 / 跟随系统」三种模式。
 * 颜色主题已收敛到单一暖琥珀 amber（详见 globals.css）。
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="主题设置"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="h-4 w-4 hidden dark:block" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-48 rounded-lg border border-ink-200 bg-card shadow-lg dark:border-ink-800"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="p-2">
            <div className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5 px-2">
              主题模式
            </div>
            <div className="space-y-1">
              {[
                { v: "light" as const, label: "浅色", icon: Sun },
                { v: "dark" as const, label: "深色", icon: Moon },
                { v: "system" as const, label: "跟随系统", icon: Monitor },
              ].map((item) => (
                <button
                  key={item.v}
                  type="button"
                  onClick={() => setTheme(item.v)}
                  className={cn(
                    "w-full inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition",
                    theme === item.v
                      ? "bg-brand-500 text-white"
                      : "text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}