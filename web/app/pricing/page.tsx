import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Wrench, FileDown, Bot } from "lucide-react";

export const metadata: Metadata = { title: "会员定价" };

const PLANS = [
  {
    code: "free",
    name: "免费",
    price: 0,
    period: "永久",
    monthly: "",
    highlight: false,
    cta: "免费开始",
    features: [
      "浏览所有公开文章（9 篇引流）",
      "AI 问答 20 次 / 日",
      "引流品：岗位评估表 + 诊断表 + 提示词 5 条",
    ],
  },
  {
    code: "member",
    name: "会员",
    price: 299,
    period: "年",
    monthly: "约 ¥25/月",
    highlight: true,
    cta: "立即订阅",
    features: [
      "全部会员内容（29+ 篇实战，持续更新）",
      "7 个实战工具交付包（出纳/回单/大表/台账…）",
      "可下载 Excel 模板 + Python 脚本",
      "AI 问答 500 次 / 日（基于知识库 + 引用溯源）",
      "每周新内容邮件推送",
    ],
  },
  {
    code: "pro",
    name: "Pro 企业",
    price: 2999,
    period: "年",
    monthly: "或 ¥299/月",
    highlight: false,
    cta: "联系开通",
    features: [
      "会员全部权益",
      "团队账号（5 席位起）",
      "正规发票 + 对公转账",
      "优先答疑 + 季度复盘会",
      "1v1 咨询 9 折",
    ],
  },
];

const VALUES = [
  {
    icon: Wrench,
    title: "7 个实战工具交付包",
    desc: "出纳流水 / 付款回单 OCR / 销售大表 / 进口台账…每个都经过真实企业投产验证，不是 demo。",
  },
  {
    icon: FileDown,
    title: "可下载模板与脚本",
    desc: "Excel 模板、Python 脚本、Prompt 包，复制即用。会员区持续新增。",
  },
  {
    icon: Bot,
    title: "AI 问答（引用可溯源）",
    desc: "基于整座知识库回答，每条附引用来源。不是闲聊机器人，是懂财务的助手。",
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
          Pricing
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
          选择适合你的方案
        </h1>
        <p className="mt-3 text-base text-ink-500 dark:text-ink-400">
          会员买的不只是"看文章"，是{" "}
          <strong className="font-semibold text-ink-700 dark:text-ink-200">
            7 个能拿走用的工具 + 可下载模板
          </strong>
          。阶段 1 仅展示，订阅在阶段 2 接入。
        </p>
      </div>

      {/* 3 档套餐 */}
      <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {PLANS.map((p) => (
          <div
            key={p.code}
            className={
              "relative rounded-lg border bg-card p-6 flex flex-col transition-all " +
              (p.highlight
                ? "border-brand-500 shadow-glow ring-1 ring-brand-500 md:-translate-y-2"
                : "border-ink-200/60 dark:border-ink-800")
            }
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-[11px] text-white font-medium">
                <Sparkles className="h-3 w-3" /> 最受欢迎
              </div>
            )}
            <h2 className="text-xl font-bold tracking-tight">{p.name}</h2>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold">¥{p.price}</span>
              <span className="text-sm text-ink-500">/ {p.period}</span>
            </div>
            {p.monthly && (
              <div className="mt-1 text-xs text-ink-400">{p.monthly}</div>
            )}
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-ink-700 dark:text-ink-200">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/sign-in"
              className={
                "mt-6 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold transition " +
                (p.highlight
                  ? "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-glow"
                  : "border border-ink-200 dark:border-ink-700 hover:border-brand-400 hover:text-brand-600")
              }
            >
              {p.cta}
              {p.highlight && <ArrowRight className="h-3.5 w-3.5" />}
            </Link>
          </div>
        ))}
      </div>

      {/* 会员买的是什么（CFO：卖点从问答次数改成工具/模板）*/}
      <section className="mt-20 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
            Why Member
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            会员买的是什么
          </h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            不是"AI 问答次数"，是别人没有的实战资产。
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-lg border border-foreground/10 bg-card p-5"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mt-16 max-w-4xl mx-auto">
        <div className="rounded-lg border border-foreground/10 bg-card p-6 text-center">
          <p className="text-sm text-ink-600 dark:text-ink-300">
            还在犹豫？先{" "}
            <Link href="/kb" className="text-brand-600 hover:underline underline-offset-4 font-medium">
              免费读 9 篇引流文章
            </Link>
            ，觉得有价值再订阅。
          </p>
        </div>
      </section>
    </div>
  );
}