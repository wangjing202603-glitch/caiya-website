/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许从仓库根 content/kb 读取（web/ 上一层）
  // 注意：Next.js 不允许跳出 process.cwd() 之外 import 文件，
  // 因此 content 已在 web/content 下做软链/复制（见 README）。
};

export default nextConfig;
