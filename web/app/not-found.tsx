import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-24 max-w-2xl text-center">
      <FileQuestion className="h-12 w-12 text-ink-300 mx-auto" />
      <h1 className="text-3xl font-semibold mt-6">这篇内容可能还没写好</h1>
      <p className="mt-3 text-ink-500 dark:text-ink-400">
        你访问的页面不存在，或者正在被创作中。
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/kb"
          className="rounded-md bg-brand-500 text-white px-4 py-2 text-sm hover:bg-brand-600"
        >
          去知识库看看
        </Link>
        <Link
          href="/"
          className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800"
        >
          回首页
        </Link>
      </div>
    </div>
  );
}
