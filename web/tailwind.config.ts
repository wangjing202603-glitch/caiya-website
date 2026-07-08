import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // 品牌色由主题（globals.css 中的 --brand-* 变量）驱动，支持运行时切换
        brand: {
          50:  "hsl(var(--brand-50)  / <alpha-value>)",
          100: "hsl(var(--brand-100) / <alpha-value>)",
          200: "hsl(var(--brand-200) / <alpha-value>)",
          300: "hsl(var(--brand-300) / <alpha-value>)",
          400: "hsl(var(--brand-400) / <alpha-value>)",
          500: "hsl(var(--brand-500) / <alpha-value>)",
          600: "hsl(var(--brand-600) / <alpha-value>)",
          700: "hsl(var(--brand-700) / <alpha-value>)",
          800: "hsl(var(--brand-800) / <alpha-value>)",
          900: "hsl(var(--brand-900) / <alpha-value>)",
        },
        // 增长青
        accent: {
          50: "#ECFEF7",
          100: "#CCFBF1",
          300: "#5EEAD4",
          500: "#14B8A6",
          700: "#0F766E",
        },
        // 中性 ink — 暖中性（参照 starglowai.com：#FAFAF8 / #1C1A18，告别冷 slate 蓝灰）
        ink: {
          50:  "#FAFAF8",
          100: "#F4F3EF",
          200: "#ECECE6",
          300: "#DEDDD6",
          400: "#ABA9A2",
          500: "#6B6B6B",
          600: "#5F6368",
          700: "#3D3B38",
          800: "#2A2820",
          900: "#1C1A18",
          950: "#141311",
        },
        // 语义色
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#0EA5E9",
        // shadcn 兼容别名
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // 默认走 Noto Sans SC（由 layout.tsx 用 next/font 注入为 --font-noto-sans-sc）
        sans: [
          "var(--font-noto-sans-sc)",
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
        // 整站走无衬线后，font-serif 仅在 MDX 引用、blockquote 之类保留兜底
        serif: [
          "Songti SC",
          "STSong",
          "SimSun",
          "serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "14px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(20,15,8,0.04)",
        md: "0 2px 8px rgba(20,15,8,0.06)",
        lg: "0 8px 24px rgba(20,15,8,0.08)",
        focus: "0 0 0 3px hsl(22 92% 52% / 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out",
        "fade-in-up": "fade-in-up 240ms cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
