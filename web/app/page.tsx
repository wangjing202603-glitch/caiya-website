import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  Calculator,
  CheckCircle2,
  Compass,
  FolderKanban,
  MessageSquare,
  PiggyBank,
  Quote,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCategoryStats, getRecentArticles } from "@/lib/kb";
import { SproutingLogo } from "@/components/brand/sprouting-logo";
import { Reveal } from "@/components/brand/reveal";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ru-men-zhi-nan": Compass,
  "ai-caiwu-gongju": Bot,
  "shuiwu-yu-hegui": Calculator,
  "qiye-caiwu-guanli": Building2,
  "geren-licai": PiggyBank,
  "anli-yu-moban": FolderKanban,
};

// 12 周路径，按 3 阶段分组
const PHASES: {
  name: string;
  subtitle: string;
  weeks: { week: number; title: string }[];
}[] = [
  {
    name: "基础期",
    subtitle: "W1–W4 · 重建认知",
    weeks: [
      { week: 1, title: "AI 财务 · 个人能力边界" },
      { week: 2, title: "建立 AI First 思维" },
      { week: 3, title: "AI 工具盘点与选型" },
      { week: 4, title: "Prompt 模板与脚本库" },
    ],
  },
  {
    name: "实战期",
    subtitle: "W5–W8 · 嵌入工作",
    weeks: [
      { week: 5, title: "Excel × AI 自动化" },
      { week: 6, title: "增值税申报的 AI 改造" },
      { week: 7, title: "个税年度汇算 AI 助手" },
      { week: 8, title: "AI 月末结账工作流" },
    ],
  },
  {
    name: "进阶期",
    subtitle: "W9–W12 · 产出成果",
    weeks: [
      { week: 9, title: "现金流预测模型" },
      { week: 10, title: "合同 / 发票 AI 审阅" },
      { week: 11, title: "经营报表 AI 分析" },
      { week: 12, title: "从工具到智能体" },
    ],
  },
];

export default async function HomePage() {
  const stats = getCategoryStats();
  const total = stats.reduce((s, c) => s + c.count, 0);
  const latest = getRecentArticles(1)[0];

  return (
    <div>
      {/* ───────── Hero：暖米白底 + 琥珀径向辉光 + 颗粒纹理 + 发芽logo + 真数据杂志卡 ───────── */}
      <section className="relative overflow-hidden bg-ink-50 dark:bg-ink-950 hero-grain">
        {/* 琥珀径向辉光（参考 starglowai hero-glow）—— 右上可见焦点 */}
        <div
          aria-hidden
          className="absolute -top-40 right-0 h-[36rem] w-[36rem] hero-amber-glow opacity-50 blur-2xl rounded-full"
        />
        <div
          aria-hidden
          className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl"
        />
        <div className="container relative pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            {/* 左：价值主张 */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 dark:bg-ink-900/60 dark:border-brand-800 px-3 py-1 text-xs text-brand-700 dark:text-brand-300">
                <SproutingLogo size={20} />
                财芽 · AI 财务新芽
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                让每个财务人，
                <br />
                <span className="text-brand-600">都用得上 AI 助理</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-ink-600 dark:text-ink-300 max-w-xl leading-relaxed">
                从工具到工作流，把重复劳动留给机器，把判断留给自己。
                <br className="hidden md:block" />
                12 周系统训练，跟一线财务经理一起长出来。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/kb"
                  className="inline-flex items-center gap-2 rounded-md bg-brand-500 text-white px-6 py-3 text-sm font-semibold hover:bg-brand-600 hover:shadow-glow animate-breathe-glow transition-all"
                >
                  免费读知识库
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-md border border-ink-300 bg-card px-6 py-3 text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition-all"
                >
                  了解会员权益
                </Link>
              </div>
              {/* proof stats */}
              <div className="mt-10 flex items-center gap-x-8 gap-y-3 flex-wrap">
                <Stat value={`${total}+`} label="实战文章" />
                <span className="hidden sm:block h-8 w-px bg-foreground/10" />
                <Stat value="12" label="周训练计划" />
                <span className="hidden sm:block h-8 w-px bg-foreground/10" />
                <Stat value={`${stats.length}`} label="大板块覆盖" />
              </div>
            </div>

            {/* 右：最新一篇杂志卡（真数据） */}
            {latest && (
              <div className="relative">
                <div className="absolute -inset-3 rounded-lg bg-gradient-to-br from-brand-200/40 to-transparent dark:from-brand-800/20 blur-xl" />
                <Link
                  href={`/kb/${latest.categorySlug}/${latest.slug}`}
                  className="group relative block rounded-lg border border-foreground/10 bg-white dark:bg-ink-900 p-7 shadow-glow hover:shadow-glow-strong hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 text-xs font-medium">
                      <RefreshCcw className="h-3 w-3" />
                      最近更新 · {latest.updatedAt}
                    </span>
                    <Quote className="h-5 w-5 text-brand-400" />
                  </div>
                  <h2 className="mt-5 text-2xl md:text-3xl font-bold leading-snug tracking-tight group-hover:text-brand-600 transition">
                    {latest.title}
                  </h2>
                  <p className="mt-3 text-sm text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-3">
                    {latest.description}
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 border-t border-foreground/10 pt-4 text-xs text-ink-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    {latest.readingMinutes} 分钟阅读
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────── 板块导航：卡片网格 + 图标 + 描述 ───────── */}
      <section className="container py-16 md:py-24">
        <Reveal>
        <SectionHead
          eyebrow="Knowledge"
          title={`${stats.length} 大板块，全场景覆盖`}
          desc="按财务主题分板块，标有「免费」的篇目可直接阅读，其余内容加入会员后开放。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((c, i) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? BookOpen;
            const featured = i === 0;
            return (
              <Link
                key={c.id}
                href={`/kb/${c.slug}`}
                className={
                  "group relative rounded-lg border bg-card p-6 hover:shadow-glow hover:-translate-y-1 transition-all " +
                  (featured
                    ? "border-brand-300 border-l-2 border-l-brand-500"
                    : "border-foreground/10 hover:border-brand-400")
                }
              >
                {featured && (
                  <span className="absolute right-4 top-4 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">
                    推荐起点
                  </span>
                )}
                {!featured && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-6 bottom-6 w-0.5 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                  />
                )}
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  {!featured && (
                    <span className="text-xs font-mono text-ink-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight group-hover:text-brand-600 transition">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2">
                  {c.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-ink-500">{c.count} 篇内容</span>
                  <span className="inline-flex items-center gap-1 text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition">
                    进入 <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        </Reveal>
      </section>

      {/* ───────── 12 周训练：3 阶段路线图 ───────── */}
      <section className="bg-ink-50/60 dark:bg-ink-900/40 border-y border-foreground/5">
        <div className="container py-16 md:py-24">
          <Reveal>
          <SectionHead
            eyebrow="Roadmap"
            title="12 周训练计划"
            desc="每周一个主题，把 AI 放进真实工作。2026 夏季首期 6/27 开营，全程回放 + 学员资料库。"
            center
          />
          <div className="mt-12 space-y-10">
            {PHASES.map((phase, pi) => (
              <div key={phase.name}>
                {/* 阶段头 */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                    {pi + 1}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {phase.name}
                  </h3>
                  <span className="text-xs font-mono text-ink-500 tracking-wider">
                    {phase.subtitle}
                  </span>
                  <span className="flex-1 h-px bg-foreground/10" />
                </div>
                {/* 周卡片 */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {phase.weeks.map((w) => (
                    <div
                      key={w.week}
                      className="group rounded-lg border border-foreground/10 bg-white dark:bg-ink-900 p-4 hover:border-brand-300 hover:shadow-sm transition"
                    >
                      <div className="text-[11px] font-mono tracking-widest text-brand-600">
                        WEEK {String(w.week).padStart(2, "0")}
                      </div>
                      <div className="mt-2 text-sm font-medium leading-snug group-hover:text-brand-600 transition">
                        {w.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── AI 问答：展示带 + 对话气泡 ───────── */}
      <section className="container py-16 md:py-24">
        <Reveal>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead
              eyebrow="AI Assistant"
              title="问一句，答一篇"
              desc="用中文直接提问，AI 基于整座知识库回答，并附上引用来源。会员 20 次/日，Pro 50 次/日。"
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/kb/search?mode=ai"
                className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                <MessageSquare className="h-4 w-4" />
                试一下 AI 问答
              </Link>
              <Link
                href="/kb"
                className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600 transition"
              >
                或浏览全部文章 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <MiniCheck icon={ShieldCheck} text="引用可溯源" />
              <MiniCheck icon={RefreshCcw} text="同步最新政策" />
              <MiniCheck icon={CheckCircle2} text="财务专家复核" />
            </div>
          </div>

          {/* 对话演示卡 */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-lg bg-gradient-to-br from-brand-200/40 to-transparent dark:from-brand-800/20 blur-xl" />
            <div className="relative rounded-lg border border-foreground/10 bg-white dark:bg-ink-900 p-6 shadow-glow space-y-4">
              {/* 用户问 */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg rounded-br-sm bg-brand-500 text-white px-4 py-2.5 text-sm">
                  小规模纳税人季度销售额不超 30 万，还免增值税吗？
                </div>
              </div>
              {/* AI 答 */}
              <div className="flex justify-start gap-2">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-ink-100 dark:bg-ink-800 px-4 py-2.5 text-sm leading-relaxed">
                  2026 年政策下，小规模纳税人月销售额 ≤ 10 万（季 ≤ 30 万）仍免征增值税。
                  引用来源：
                  <span className="text-brand-600">《增值税减免政策解读》</span>
                </div>
              </div>
              <div className="flex justify-start gap-2">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-ink-100 dark:bg-ink-800 px-4 py-2.5 text-sm leading-relaxed">
                  但注意：开具专票部分不免税，且需按期申报。
                </div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ───────── 底部会员 CTA 横幅 ───────── */}
      <section className="container pb-20">
        <Reveal>
        <div className="relative overflow-hidden rounded-lg bg-ink-900 dark:bg-ink-950 text-white p-8 md:p-12">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl"
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 text-brand-300 px-2.5 py-0.5 text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                跃迁计划 · 2026 夏季首期
              </div>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
                12 周，长成一个用 AI 的财务人
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl leading-relaxed">
                ¥199/年早鸟价 · 含全部会员内容 + 7 个实战工具 + AI 问答。
                试用期免费体验，订阅即将开通。
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold shadow-glow transition"
            >
              查看会员方案 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ───────── 子组件 ───────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{label}</div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  desc,
  center,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="text-xs font-mono tracking-widest text-brand-600 uppercase">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {desc && (
        <p className="mt-3 text-sm md:text-base text-ink-500 dark:text-ink-400 leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}

function MiniCheck({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-foreground/10 bg-card p-3 text-center">
      <Icon className="h-5 w-5 text-brand-600" />
      <span className="text-xs text-ink-600 dark:text-ink-300">{text}</span>
    </div>
  );
}