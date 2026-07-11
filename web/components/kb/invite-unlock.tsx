"use client";

import * as React from "react";
import { Lock, CheckCircle2 } from "lucide-react";

/**
 * 会员内容门禁：未解锁显示邀请码输入框，解锁后显示正文。
 *
 * 邀请码管理：在下面 INVITE_CODES 里加码 + 到期日。
 * Excel 里记"谁拿了哪个码"，这里只存码和到期日。
 * 加人：复制一行，改码号即可。
 *
 * 纯前端方案（F12 理论上能看到码列表），
 * 内测期够用——试用人员不会去偷码。
 * 长期可升级为 API 验证（码存服务器，前端不可见）。
 */
const INVITE_CODES: Record<string, string> = {
  "CAIYA-001": "2026-08-31",
  "CAIYA-002": "2026-08-31",
  "CAIYA-003": "2026-08-31",
  "CAIYA-004": "2026-08-31",
  "CAIYA-005": "2026-08-31",
  "CAIYA-006": "2026-08-31",
  "CAIYA-007": "2026-08-31",
  "CAIYA-008": "2026-08-31",
  "CAIYA-009": "2026-08-31",
  "CAIYA-010": "2026-08-31",
  "CAIYA-011": "2026-08-31",
  "CAIYA-012": "2026-08-31",
  "CAIYA-013": "2026-08-31",
  "CAIYA-014": "2026-08-31",
  "CAIYA-015": "2026-08-31",
  "CAIYA-016": "2026-08-31",
  "CAIYA-017": "2026-08-31",
  "CAIYA-018": "2026-08-31",
  "CAIYA-019": "2026-08-31",
  "CAIYA-020": "2026-08-31",
};

const STORAGE_KEY = "caiya-invite-code";

function isValidCode(code: string): boolean {
  const expiry = INVITE_CODES[code.toUpperCase().trim()];
  if (!expiry) return false;
  return new Date(expiry).getTime() > Date.now();
}

/**
 * 会员内容门禁组件。
 * 接收 children（正文 MDX），未解锁时不渲染 children。
 */
export function MemberGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidCode(saved)) {
      setUnlocked(true);
    }
  }, []);

  function handleUnlock() {
    const code = input.trim().toUpperCase();
    if (isValidCode(code)) {
      localStorage.setItem(STORAGE_KEY, code);
      setUnlocked(true);
      setError("");
    } else {
      setError("邀请码无效或已过期，请检查后重试");
    }
  }

  // SSG 构建时 / 客户端未验证：显示锁定界面（正文不渲染）
  if (!mounted || !unlocked) {
    return (
      <div className="not-prose mt-8 rounded-lg border border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-ink-900 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">这是会员内容</h3>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
          输入邀请码解锁全文。试用期内有效。
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="CAIYA-XXX"
            className="flex-1 rounded-md border border-ink-300 dark:border-ink-700 bg-background px-3 py-2 text-sm text-center uppercase tracking-wider focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleUnlock}
            className="rounded-md bg-brand-500 text-white px-4 py-2 text-sm font-semibold hover:bg-brand-600 transition"
          >
            解锁
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
        <p className="mt-4 text-xs text-ink-400">
          没有邀请码？在小红书搜「财芽」关注，获取免费试用名额
        </p>
      </div>
    );
  }

  // 已解锁：渲染正文
  return (
    <>
      <div className="not-prose mb-4 rounded-md border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/10 px-4 py-2 text-xs text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        已解锁会员内容（试用期至 2026-08-31）
      </div>
      {children}
    </>
  );
}