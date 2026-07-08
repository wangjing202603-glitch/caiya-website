"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

// 整站使用单 amber 主题（参照 starglowai.com），不再支持多色彩切换。
export const THEME_ID = "amber" as const;

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.setAttribute("data-theme", THEME_ID);
  root.style.colorScheme = resolved;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  attribute: _attribute,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange: _disableTransition,
  children,
}: {
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );

  React.useEffect(() => {
    const storedTheme =
      (localStorage.getItem("theme") as Theme | null) ?? defaultTheme;
    setThemeState(storedTheme);
    const resolved =
      storedTheme === "system"
        ? getSystemTheme()
        : (storedTheme as "light" | "dark");
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme]);

  React.useEffect(() => {
    if (!enableSystem) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (theme === "system") {
        const r = getSystemTheme();
        setResolvedTheme(r);
        applyTheme(r);
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme, enableSystem]);

  const setTheme = React.useCallback(
    (t: Theme) => {
      setThemeState(t);
      localStorage.setItem("theme", t);
      const resolved =
        t === "system" ? getSystemTheme() : (t as "light" | "dark");
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}