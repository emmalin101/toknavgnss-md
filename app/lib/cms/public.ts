import { readCmsDataSync } from "./storage";
import type { CmsBlock, CmsPage, CmsSettings } from "./types";

export function getPublishedCmsPageByPath(path: string): CmsPage | null {
  const trimPath = (value: string) => (value === "/" ? "/" : value.replace(/\/$/, ""));
  const normalizedPath = trimPath(path);
  const data = readCmsDataSync();
  return data.pages.find((page) => page.status === "published" && trimPath(page.path) === normalizedPath) ?? null;
}

export function getCmsSettings(): CmsSettings {
  return readCmsDataSync().settings;
}

export function getBlock(page: CmsPage | null, type: CmsBlock["type"], title?: string) {
  if (!page) return null;
  return (
    page.blocks.find((block) => block.type === type && (!title || block.title === title)) ??
    page.blocks.find((block) => block.type === type) ??
    null
  );
}

export function getBlockData<T extends Record<string, unknown>>(page: CmsPage | null, type: CmsBlock["type"], fallback: T, title?: string): T {
  const block = getBlock(page, type, title);
  return {
    ...fallback,
    ...((block?.data || {}) as Partial<T>)
  };
}

export function getPublishedCmsBlogPosts() {
  return readCmsDataSync().blogPosts.filter((post) => post.status === "published");
}

export function getPublishedCmsProducts() {
  return readCmsDataSync().products.filter((product) => product.status === "published");
}
