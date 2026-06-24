import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type React from "react";
import { getPublishedCmsBlogPosts } from "./cms/public";

const blogDirectory = path.join(process.cwd(), "content", "blogs");

export type BlogPost = {
  file: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  searchIntent: string;
  excerpt: string;
  content: string;
  wordCount: number;
  priority: number;
};

const articleFiles = [
  "01-how-to-choose-rtk-gnss-receiver.md",
  "02-cors-vrs-vs-base-rover-rtk.md",
  "03-gnss-auto-steering-machine-control-buying-guide.md"
];

function extractField(markdown: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`\\*\\*${escaped}:\\*\\*\\s*(.+)`));
  return match?.[1]?.replace(/^`|`$/g, "").trim() ?? "";
}

function extractH1(markdown: string) {
  const h1Section = markdown.match(/## H1\n\n(.+?)(\n\n|$)/);
  if (h1Section?.[1]) return h1Section[1].trim();
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  return firstHeading?.[1]?.replace(/^Blog \d+:\s*/, "").trim() ?? "TOKNAV Blog";
}

function extractExcerpt(markdown: string) {
  const intro = markdown.match(/## Introduction\n\n([\s\S]+?)(\n##\s|$)/);
  const text = (intro?.[1] ?? markdown)
    .replace(/[#*_`>-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 210 ? `${text.slice(0, 210).trim()}...` : text;
}

function extractArticleBody(markdown: string) {
  const start = markdown.indexOf("## Introduction");
  const publicContent = start >= 0 ? markdown.slice(start) : markdown;
  return publicContent
    .replace(/\n## Image Plan and AI Image Prompts[\s\S]*$/m, "")
    .replace(/\n## CTA and Popup Plan[\s\S]*$/m, "")
    .trim();
}

function cleanSlug(value: string, fallback: string) {
  const slug = value.replace(/^`|`$/g, "").replace(/^\/blog\//, "").replace(/^\//, "").trim();
  return slug || fallback.replace(/\.md$/, "");
}

export function getAllBlogPosts(): BlogPost[] {
  const cmsPosts = getPublishedCmsBlogPosts().map((post, index) => ({
    file: "cms",
    slug: post.slug,
    title: post.title,
    seoTitle: post.seoTitle || post.title,
    metaDescription: post.seoDescription || post.summary,
    primaryKeyword: post.tags[0] || post.category,
    searchIntent: "B2B buyer research",
    excerpt: post.summary || extractExcerpt(post.body),
    content: post.body,
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    priority: index + 1
  }));

  const cmsSlugs = new Set(cmsPosts.map((post) => post.slug));
  const filePosts = articleFiles.map((file, index) => {
    const content = fs.readFileSync(path.join(blogDirectory, file), "utf8");
    const slug = cleanSlug(extractField(content, "URL Slug"), file);
    const title = extractH1(content);
    const seoTitle = extractField(content, "SEO Title") || title;
    const metaDescription = extractField(content, "Meta Description") || extractExcerpt(content);
    const primaryKeyword = extractField(content, "Primary Keyword");
    const searchIntent = extractField(content, "Search Intent");
    const articleBody = extractArticleBody(content);
    const wordCount = articleBody.split(/\s+/).filter(Boolean).length;

    return {
      file,
      slug,
      title,
      seoTitle,
      metaDescription,
      primaryKeyword,
      searchIntent,
      excerpt: extractExcerpt(content),
      content: articleBody,
      wordCount,
      priority: cmsPosts.length + index + 1
    };
  }).filter((post) => !cmsSlugs.has(post.slug));

  return [...cmsPosts, ...filePosts];
}

export function getBlogPost(slug: string) {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function renderMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  function flushList() {
    if (!listItems.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`}>
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function flushTable() {
    if (!tableRows.length) return;
    const [head, separator, ...body] = tableRows;
    const hasSeparator = Array.isArray(separator) && separator.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
    const rows = hasSeparator ? body : separator ? [separator, ...body] : body;
    elements.push(
      <div className="blog-table-wrap" key={`table-${elements.length}`}>
        <table>
          <thead>
            <tr>{head.map((cell, index) => <th key={index}>{renderInline(cell)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{renderInline(cell)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      return;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      tableRows.push(trimmed.slice(1, -1).split("|").map((cell) => cell.trim()));
      return;
    }

    flushTable();

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      return;
    }

    flushList();

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
    if (imageMatch) {
      const [, alt, src, title] = imageMatch;
      elements.push(
        <figure className="blog-image-block" key={index}>
          <img src={src} alt={alt || title || "TOKNAV blog image"} />
          {alt || title ? <figcaption>{title || alt}</figcaption> : null}
        </figure>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(<h1 key={index}>{renderInline(trimmed.slice(2))}</h1>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={index}>{renderInline(trimmed.slice(4))}</h3>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={index}>{renderInline(trimmed.slice(3))}</h2>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(<p className="numbered-line" key={index}>{renderInline(trimmed)}</p>);
    } else {
      const linkMatch = trimmed.match(/^\*\*Suggested Link:\*\*\s*`([^`]+)`/);
      if (linkMatch) {
        elements.push(<p key={index}><strong>Suggested Link: </strong><Link href={linkMatch[1]}>{linkMatch[1]}</Link></p>);
      } else {
        elements.push(<p key={index}>{renderInline(trimmed)}</p>);
      }
    }
  });

  flushList();
  flushTable();
  return elements;
}
