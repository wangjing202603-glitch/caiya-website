import type { Metadata } from "next";

export const metadata: Metadata = { title: "用户协议" };

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-3xl prose-kb">
      <h1>用户协议</h1>
      <p>最后更新：2026-07-01</p>
      <p>
        欢迎使用财芽（以下简称"本平台"）。本协议是您与本平台之间就使用本平台服务所订立的有法律约束力的文件。
      </p>
      <h2>1. 服务内容</h2>
      <p>本平台提供 AI 财务知识库的浏览、检索、AI 问答与会员订阅服务。</p>
      <h2>2. 用户行为规范</h2>
      <ul>
        <li>不得利用本平台从事违反国家法律法规的活动</li>
        <li>不得传播未经公开的监管口径或不当言论</li>
        <li>不得对平台内容进行商业性转售</li>
      </ul>
      <h2>3. 知识产权</h2>
      <p>平台内容采用 CC BY-NC-SA 4.0 协议；代码采用 MIT 协议。详见 LICENSE 文件。</p>
      <h2>4. 免责声明</h2>
      <p>
        本平台所提供的内容仅供学习参考，不构成专业财务、税务或法律建议。具体事务请咨询持证专业人士。
      </p>
      <h2>5. 退款政策</h2>
      <p>会员订阅支持 7 天无理由退款。</p>
    </div>
  );
}
