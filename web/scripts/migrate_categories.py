#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财芽知识库 5 板块重组（方案B）——批量更新文章 frontmatter 的 category 字段。
只改 category，不动 slug/正文/其他字段。
用法：
  python migrate_categories.py            # dry-run（只打印将改什么）
  python migrate_categories.py --apply    # 实际写入
"""
import os, re, sys

KB = os.path.join(os.path.dirname(__file__), "..", "content", "kb")

# 文章 slug → 新分类 slug（基于映射表 v2）
SLUG_TO_NEW_CAT = {
    # 入门
    "zhi-shi-ku-zen-me-yong": "primer",
    "cong-nei-kai-shi-aihua": "primer",
    "aihua-zhenduan-5-xinhao": "primer",
    # 出纳
    "yinhang-liushui-15-fenzhong": "role-cashier",
    "weishenme-chuna-zui-shihe": "role-cashier",
    "chuna-v15-fupan": "role-cashier",
    # 资金与往来
    "chanzhi-risao-gaizao": "role-treasury",
    "fukuan-huidan-ocr": "role-treasury",
    "xiaoshou-dabiao-6xiaoshi": "role-treasury",
    "yingfu-pingzheng-jindie-tplus": "role-treasury",
    "xianjinliu-yuce": "role-treasury",
    "chanzhi-risao-zhuanxiang": "role-treasury",
    "huidan-5lun-gongguan": "role-treasury",
    "xiaoshou-dabiao-v11-fupan": "role-treasury",
    # 税务
    "zengzhishui-jinxiang-dikou": "role-tax",
    "xiaoguimo-zengzhishui-shenbao": "role-tax",
    "shudian-fapiao-shicao": "role-tax",
    "geshui-zhuanxiang-fujiakouchu": "role-tax",
    "yishu-zhishui-5-zhibiao": "role-tax",
    "shebao-wuxian-dangan": "role-tax",
    # 总账报表
    "zongzhang-shenhe-guize": "role-ledger",
    "sanbiao-bianzhi": "role-ledger",
    "kuanian-feiyong-5-yicuo": "role-ledger",
    # 成本
    "chengben-kuaiji-tianhuaban": "role-cost",
    "guanlianfang-chengben-huanyuan": "role-cost",
    "sunhao-biao-bom": "role-cost",
    # 管理进阶
    "zhibiao-fenxi": "role-management",
    # AI
    "ai-gongju-pandian": "ai",
    "prompt-5-yuanze": "ai",
    "prompt-jingxuan-5-tiao": "ai",
    "zhushuju-ceng-jianli": "ai",
    # 出海泰国（14）
    "taiguo-6-ge-butong": "industry-thailand",
    "taiguo-zhongjie-moshi": "industry-thailand",
    "taiguo-wu-fapiao-liezhi": "industry-thailand",
    "taiguo-vat-shiwu": "industry-thailand",
    "taiguo-wht": "industry-thailand",
    "taiguo-wht-pingzheng": "industry-thailand",
    "taiguo-jinkou-shuifei-jiaona": "industry-thailand",
    "taiguo-jinkou-ziliao-hedui": "industry-thailand",
    "taiguo-chukou-fob-qingguan": "industry-thailand",
    "jinkou-taizhang": "industry-thailand",
    "chukou-taizhang": "industry-thailand",
    "taiguo-guzi-zhejiu": "industry-thailand",
    "taiguo-boi-jidu-baogao": "industry-thailand",
    "taiguo-sso-waiji-yuangong": "industry-thailand",
    # 职业发展
    "9-gangwei-quanjing": "career",
}

APPLY = "--apply" in sys.argv

def find_slug(fm_text):
    m = re.search(r'^slug:\s*["\']?([^"\'\n]+)["\']?\s*$', fm_text, re.M)
    return m.group(1).strip() if m else None

def find_category(fm_text):
    m = re.search(r'^category:\s*["\']?([^"\'\n]+)["\']?\s*$', fm_text, re.M)
    return m.group(1).strip() if m else None

changed, skipped, nomap = [], [], []
for root, _, files in os.walk(KB):
    for fn in files:
        if not fn.endswith(".mdx"):
            continue
        path = os.path.join(root, fn)
        with open(path, encoding="utf-8") as f:
            content = f.read()
        # 拆 frontmatter
        parts = content.split("---", 2)
        if len(parts) < 3:
            skipped.append((fn, "无frontmatter"))
            continue
        fm = parts[1]
        slug = find_slug(fm)
        old_cat = find_category(fm)
        if not slug:
            skipped.append((fn, "无slug字段"))
            continue
        new_cat = SLUG_TO_NEW_CAT.get(slug)
        if not new_cat:
            nomap.append((fn, slug))
            continue
        if old_cat == new_cat:
            continue  # 已是目标值
        # 替换 category 行（兼容引号/无引号）
        new_fm = re.sub(
            r'(^category:\s*)["\']?[^"\'\n]+["\']?\s*$',
            rf'\1"{new_cat}"',
            fm, count=1, flags=re.M
        )
        changed.append((fn, slug, old_cat, new_cat))
        if APPLY:
            new_content = "---" + new_fm + "---" + parts[2]
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)

print(f"=== {'已应用' if APPLY else 'DRY-RUN（未写入）'} ===")
print(f"将改/已改: {len(changed)} 篇")
for fn, slug, o, n in sorted(changed):
    print(f"  {slug:36} {o:24} → {n}")
if skipped: print(f"\n跳过: {len(skipped)}"); [print(f"  {f}: {r}") for f, r in skipped]
if nomap: print(f"\n⚠️ 无映射(需补): {len(nomap)}"); [print(f"  {f} slug={s}") for f, s in nomap]
if not APPLY:
    print("\n确认无误后加 --apply 实际写入")
