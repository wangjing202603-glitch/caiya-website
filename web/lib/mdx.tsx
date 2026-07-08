import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import type { ReactElement } from "react";
import { Callout } from "@/components/kb/callout";

/**
 * 编译 MDX 字符串为 React 元素。
 * 同时抽取 h2/h3 目录。
 */
export interface Heading {
  depth: 2 | 3;
  text: string;
  slug: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\s\u3000]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}\-_]+/gu, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function extractHeadings(source: string): Heading[] {
  const lines = source.split(/\r?\n/);
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = m[2].replace(/`/g, "").trim();
    if (!text) continue;
    headings.push({ depth, text, slug: slugify(text) });
  }
  // 兼容 rehype-slug 默认实现：它使用 github-slugger
  // 这里我们采用自己的 slugify 以保持稳定；rehype-slug 会再处理一次。
  return headings;
}

export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeKatex],
      },
    },
    components: {
      Callout,
    },
  });
  return content as ReactElement;
}
