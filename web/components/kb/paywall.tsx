import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

interface Props {
  requiredPlan?: "member" | "pro";
  previewMode?: boolean;
}

export function Paywall({ requiredPlan = "member", previewMode = false }: Props) {
  return (
    <aside
      role="region"
      aria-label="会员内容"
      className="not-prose my-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-ink-900 p-6 md:p-8"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-amber-500/10 p-2">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            这部分内容仅对 {requiredPlan === "pro" ? "Pro" : "会员"}开放
          </h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
            {previewMode
              ? "你正在看预览（公开部分），完整内容包含详细步骤、模板和案例。"
              : "解锁后可查看完整步骤、Excel 模板、Prompt 脚本与每季度更新。"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
            >
              <Sparkles className="h-4 w-4" />
              查看会员方案
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 transition"
            >
              已订阅？登录
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
