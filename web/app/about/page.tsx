import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于社群" };

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold">关于财芽</h1>
      <div className="prose-kb mt-6">
        <p>
          财芽是一个聚焦「AI × 财务 / 税务 / 合规」的中文知识社群。
          我们把财务人从重复劳动里解放出来，把判断留给人。
        </p>
        <h2>我们做什么</h2>
        <ul>
          <li>维护一个高质量的 AI 财务知识库（30~200 篇持续扩充）</li>
          <li>提供 AI 财务问答助手（阶段 3 启用）</li>
          <li>运营付费会员与微信群，促进同行交流</li>
        </ul>
        <h2>我们不做什么</h2>
        <ul>
          <li>不承诺收益、节税金额、避税方案</li>
          <li>不传播未公开的监管口径</li>
          <li>不做代账、代报税等执行服务（仅做知识与方法论）</li>
          <li>不做海外税务（V1 范围外）</li>
        </ul>
        <h2>加入我们</h2>
        <p>
          免费加入微信群：扫码页脚公众号菜单。会员订阅：<a href="/pricing">查看方案</a>。
        </p>
      </div>
    </div>
  );
}
