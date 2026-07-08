import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "登录" };

export default function SignInPage() {
  return (
    <div className="container py-20 max-w-md">
      <div className="rounded-xl border border-ink-200/60 dark:border-ink-800 bg-card p-8">
        <h1 className="text-2xl font-semibold">登录 AI 财务社群</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          阶段 1 占位：真实登录在阶段 2 接入 Auth.js（邮箱 / 手机号 / 微信）。
        </p>

        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-ink-600 dark:text-ink-300">邮箱</span>
            <input
              type="email"
              required
              disabled
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-ink-200 dark:border-ink-700 bg-background px-3 py-2 text-sm opacity-60"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-600 dark:text-ink-300">密码</span>
            <input
              type="password"
              required
              disabled
              className="mt-1 w-full rounded-md border border-ink-200 dark:border-ink-700 bg-background px-3 py-2 text-sm opacity-60"
            />
          </label>
          <button
            type="button"
            disabled
            className="w-full rounded-md bg-brand-500 text-white py-2 text-sm font-medium opacity-60"
          >
            登录（阶段 2 启用）
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-500">
          还没有账号？<Link className="text-brand-600" href="/pricing">了解会员</Link>
        </div>
      </div>
    </div>
  );
}
