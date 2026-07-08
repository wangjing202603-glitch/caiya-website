import type { Metadata } from "next";

export const metadata: Metadata = { title: "隐私政策" };

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-3xl prose-kb">
      <h1>隐私政策</h1>
      <p>最后更新：2026-07-01</p>
      <p>
        我们非常重视您的隐私。本政策说明我们如何收集、使用、存储和保护您的个人信息。
        我们遵循《个人信息保护法》等相关法律法规。
      </p>
      <h2>1. 收集的信息</h2>
      <ul>
        <li>账户信息：邮箱、手机号、昵称、头像</li>
        <li>使用信息：浏览记录、搜索查询、AI 问答内容</li>
        <li>设备信息：浏览器、操作系统、IP 地址</li>
      </ul>
      <h2>2. 信息使用</h2>
      <p>用于：账户管理、内容推荐、AI 问答服务改进、安全审计与合规。</p>
      <h2>3. 信息共享</h2>
      <p>我们不会出售您的个人信息。仅在以下情况共享：</p>
      <ul>
        <li>获得您的明确同意</li>
        <li>法律法规要求</li>
        <li>与必要的服务提供商（如支付、AI 供应商）共享最小必要信息</li>
      </ul>
      <h2>4. 您的权利</h2>
      <p>您有权查询、更正、删除您的个人信息，或注销账户。请联系 <code>hi@aicaiwu.cn</code>。</p>
      <h2>5. Cookie 使用</h2>
      <p>我们使用必要的 Cookie 维持登录状态；使用 Plausible 进行隐私友好的访问统计，不涉及跨站跟踪。</p>
    </div>
  );
}
