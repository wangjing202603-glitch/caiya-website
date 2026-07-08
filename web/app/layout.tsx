import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";

// 主字体：Noto Sans SC（无衬线，现代极简，贴近 starglowai.com）
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "财芽 · AI 财务新芽",
    template: "%s - 财芽",
  },
  description:
    "财芽 · 让每个财务人都能用上 AI 助理。把重复劳动留给机器，把判断留给自己。",
  metadataBase: new URL("https://aicaiwu.cn"),
  icons: {
    icon: "/logo/favicon-32.png",
    apple: "/logo/favicon-32.png",
  },
  openGraph: {
    title: "财芽 · AI 财务新芽",
    description: "让每个财务人都能用上 AI 助理。",
    images: ["/logo/og-image.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={notoSansSC.variable}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Topbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
