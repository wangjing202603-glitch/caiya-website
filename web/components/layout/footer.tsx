import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 dark:border-ink-800 mt-20">
      <div className="container py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/favicon-32.png"
              alt="财芽"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-lg font-semibold">财芽</span>
          </div>
          <p className="text-ink-500 dark:text-ink-400 leading-relaxed">
            AI 财务新芽。让每个财务人都能用上 AI 助理，把重复劳动留给机器，把判断留给自己。
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-ink-800 dark:text-ink-100">
            产品
          </div>
          <ul className="space-y-2 text-ink-500 dark:text-ink-400">
            <li><Link className="hover:text-brand-600" href="/kb">知识库</Link></li>
            <li><Link className="hover:text-brand-600" href="/pricing">会员定价</Link></li>
            <li><Link className="hover:text-brand-600" href="/about">关于社群</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-ink-800 dark:text-ink-100">
            法律
          </div>
          <ul className="space-y-2 text-ink-500 dark:text-ink-400">
            <li><Link className="hover:text-brand-600" href="/legal/terms">用户协议</Link></li>
            <li><Link className="hover:text-brand-600" href="/legal/privacy">隐私政策</Link></li>
            <li>ICP 备案：待申请</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-ink-800 dark:text-ink-100">
            联系
          </div>
          <ul className="space-y-2 text-ink-500 dark:text-ink-400">
            <li>邮箱：hi@aicaiwu.cn</li>
            <li>公众号：财芽 · AI 财务</li>
            <li>© 2026 财芽 CaiYa</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
