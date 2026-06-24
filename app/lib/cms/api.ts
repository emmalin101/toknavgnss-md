import { NextResponse } from "next/server";
import { getCurrentAdmin } from "./auth";
import { createId, nowIso, slugify } from "./defaults";
import type { CmsBlock, CmsBlogPost, CmsPage, CmsProduct, CmsProductSpec, CmsStatus } from "./types";

export function jsonError(message: string, status = 400, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, errors }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export async function requireAdminApi() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return admin;
}

export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function cleanString(value: unknown, maxLength = 5000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function cleanStatus(value: unknown): CmsStatus {
  return value === "published" ? "published" : "draft";
}

export function cleanStringArray(value: unknown, maxItems = 24) {
  if (Array.isArray(value)) {
    return value.map((item) => cleanString(item, 80)).filter(Boolean).slice(0, maxItems);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => cleanString(item, 80)).filter(Boolean).slice(0, maxItems);
  }
  return [];
}

export function cleanSpecs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const spec = item as Partial<CmsProductSpec>;
      const label = cleanString(spec.label, 120);
      const specValue = cleanString(spec.value, 1000);
      return label && specValue ? { label, value: specValue } : null;
    })
    .filter(Boolean) as CmsProductSpec[];
}

export function cleanBlocks(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const block = item as Partial<CmsBlock>;
      const type = block.type;
      if (!type || !["hero", "rich_text", "image", "gallery", "cta", "faq", "custom"].includes(type)) return null;
      return {
        id: cleanString(block.id, 80) || createId("block"),
        type,
        title: cleanString(block.title, 160),
        data: block.data && typeof block.data === "object" && !Array.isArray(block.data) ? block.data : {}
      } satisfies CmsBlock;
    })
    .filter(Boolean) as CmsBlock[];
}

type PageInput = Partial<CmsPage>;

export function normalizePageInput(input: PageInput, existing?: CmsPage): CmsPage {
  const now = nowIso();
  const title = cleanString(input.title, 180) || existing?.title || "Untitled Page";
  const path = cleanString(input.path, 220) || existing?.path || "/";
  const slug = cleanString(input.slug, 120) || existing?.slug || slugify(title);

  return {
    id: existing?.id || cleanString(input.id, 80) || createId("page"),
    title,
    slug: slugify(slug, "page"),
    path: path.startsWith("/") ? path : `/${path}`,
    seoTitle: cleanString(input.seoTitle, 220) || existing?.seoTitle || title,
    seoDescription: cleanString(input.seoDescription, 360) || existing?.seoDescription || "",
    ogImage: cleanString(input.ogImage, 500) || existing?.ogImage || "",
    status: cleanStatus(input.status || existing?.status),
    blocks: cleanBlocks(input.blocks || existing?.blocks),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

type BlogInput = Partial<CmsBlogPost>;

export function normalizeBlogInput(input: BlogInput, existing?: CmsBlogPost): CmsBlogPost {
  const now = nowIso();
  const title = cleanString(input.title, 220) || existing?.title || "Untitled Blog Post";
  const slug = cleanString(input.slug, 160) || existing?.slug || slugify(title);

  return {
    id: existing?.id || cleanString(input.id, 80) || createId("blog"),
    title,
    slug: slugify(slug, "blog-post"),
    summary: cleanString(input.summary, 600) || existing?.summary || "",
    body: cleanString(input.body, 100000) || existing?.body || "",
    coverImage: cleanString(input.coverImage, 500) || existing?.coverImage || "",
    category: cleanString(input.category, 120) || existing?.category || "GNSS",
    tags: cleanStringArray(input.tags || existing?.tags),
    seoTitle: cleanString(input.seoTitle, 220) || existing?.seoTitle || title,
    seoDescription: cleanString(input.seoDescription, 360) || existing?.seoDescription || "",
    publishedAt: cleanString(input.publishedAt, 60) || existing?.publishedAt || now,
    author: cleanString(input.author, 120) || existing?.author || "TOKNAV",
    status: cleanStatus(input.status || existing?.status),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

type ProductInput = Partial<CmsProduct>;

export function normalizeProductInput(input: ProductInput, existing?: CmsProduct): CmsProduct {
  const now = nowIso();
  const name = cleanString(input.name, 220) || existing?.name || "Untitled Product";
  const slug = cleanString(input.slug, 160) || existing?.slug || slugify(name);

  return {
    id: existing?.id || cleanString(input.id, 80) || createId("product"),
    name,
    slug: slugify(slug, "product"),
    type: cleanString(input.type, 180) || existing?.type || "",
    summary: cleanString(input.summary, 700) || existing?.summary || "",
    description: cleanString(input.description, 100000) || existing?.description || "",
    price: cleanString(input.price, 80) || existing?.price || "",
    image: cleanString(input.image, 500) || existing?.image || "",
    gallery: cleanStringArray(input.gallery || existing?.gallery, 32),
    category: cleanString(input.category, 160) || existing?.category || "gnss-receivers",
    tags: cleanStringArray(input.tags || existing?.tags),
    applications: cleanStringArray(input.applications || existing?.applications, 32),
    highlights: cleanStringArray(input.highlights || existing?.highlights, 32),
    specs: cleanSpecs(input.specs || existing?.specs),
    status: cleanStatus(input.status || existing?.status),
    featured: Boolean(input.featured ?? existing?.featured),
    seoTitle: cleanString(input.seoTitle, 220) || existing?.seoTitle || name,
    seoDescription: cleanString(input.seoDescription, 360) || existing?.seoDescription || "",
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

export function validateRequired(fields: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value.trim()) errors[key] = "This field is required.";
  }
  return errors;
}
