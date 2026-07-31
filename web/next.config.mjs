/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许从仓库根 content/kb 读取（web/ 上一层）
  // 注意：Next.js 不允许跳出 process.cwd() 之外 import 文件，
  // 因此 content 已在 web/content 下做软链/复制（见 README）。

  // ===== 5 板块重组（方案B）301 重定向 =====
  // 旧 /kb/{旧分类}/{slug} → 新 /kb/{新分类}/{slug}
  // slug 保持拼音不变，只改分类段。specific 在前，pattern(catch-all) 在后。
  async redirects() {
    return [
      // --- 旧20「账务与报表」拆分：2篇移走，其余→role-ledger ---
      { source: "/kb/zhangwu-yu-baobiao/shebao-wuxian-dangan", destination: "/kb/role-tax/shebao-wuxian-dangan", permanent: true },
      { source: "/kb/zhangwu-yu-baobiao/zhibiao-fenxi", destination: "/kb/role-management/zhibiao-fenxi", permanent: true },
      { source: "/kb/zhangwu-yu-baobiao/:slug", destination: "/kb/role-ledger/:slug", permanent: true },

      // --- 旧40「资金与往来」拆分：2篇→role-cashier，其余→role-treasury ---
      { source: "/kb/zijin-yu-wanglai/yinhang-liushui-15-fenzhong", destination: "/kb/role-cashier/yinhang-liushui-15-fenzhong", permanent: true },
      { source: "/kb/zijin-yu-wanglai/weishenme-chuna-zui-shihe", destination: "/kb/role-cashier/weishenme-chuna-zui-shihe", permanent: true },
      { source: "/kb/zijin-yu-wanglai/:slug", destination: "/kb/role-treasury/:slug", permanent: true },

      // --- 旧70「案例与模板」全拆（6篇各归位）---
      { source: "/kb/anli-yu-moban/9-gangwei-quanjing", destination: "/kb/career/9-gangwei-quanjing", permanent: true },
      { source: "/kb/anli-yu-moban/chuna-v15-fupan", destination: "/kb/role-cashier/chuna-v15-fupan", permanent: true },
      { source: "/kb/anli-yu-moban/chanzhi-risao-zhuanxiang", destination: "/kb/role-treasury/chanzhi-risao-zhuanxiang", permanent: true },
      { source: "/kb/anli-yu-moban/huidan-5lun-gongguan", destination: "/kb/role-treasury/huidan-5lun-gongguan", permanent: true },
      { source: "/kb/anli-yu-moban/xiaoshou-dabiao-v11-fupan", destination: "/kb/role-treasury/xiaoshou-dabiao-v11-fupan", permanent: true },
      { source: "/kb/anli-yu-moban/zhushuju-ceng-jianli", destination: "/kb/ai/zhushuju-ceng-jianli", permanent: true },

      // --- 1:1 分类（pattern）---
      { source: "/kb/ru-men-zhi-nan/:slug", destination: "/kb/primer/:slug", permanent: true },
      { source: "/kb/shuiwu-shicao/:slug", destination: "/kb/role-tax/:slug", permanent: true },
      { source: "/kb/chengben-yu-yusuan/:slug", destination: "/kb/role-cost/:slug", permanent: true },
      { source: "/kb/ai-gongju-yu-fangfa/:slug", destination: "/kb/ai/:slug", permanent: true },
      { source: "/kb/chuhai-thaiguo/:slug", destination: "/kb/industry-thailand/:slug", permanent: true },

      // --- 旧分类页（无 slug）---
      { source: "/kb/ru-men-zhi-nan", destination: "/kb/primer", permanent: true },
      { source: "/kb/shuiwu-shicao", destination: "/kb/role-tax", permanent: true },
      { source: "/kb/zhangwu-yu-baobiao", destination: "/kb/role-ledger", permanent: true },
      { source: "/kb/chengben-yu-yusuan", destination: "/kb/role-cost", permanent: true },
      { source: "/kb/zijin-yu-wanglai", destination: "/kb/role-treasury", permanent: true },
      { source: "/kb/ai-gongju-yu-fangfa", destination: "/kb/ai", permanent: true },
      { source: "/kb/chuhai-thaiguo", destination: "/kb/industry-thailand", permanent: true },
      { source: "/kb/anli-yu-moban", destination: "/kb", permanent: true },
    ];
  },
};

export default nextConfig;
