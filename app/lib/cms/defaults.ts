import type { CmsAuthStore, CmsData, CmsSettings } from "./types";
import { CONTACT_PHONE, PRIMARY_CONTACT_EMAIL, SALES_CONTACT_EMAIL, WHATSAPP_PHONE } from "../contactInfo";

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix = "cms") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function slugify(value: string, fallback = "item") {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

export function normalizePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "home" || trimmed === "/home") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function getDefaultSettings(): CmsSettings {
  return {
    siteName: "TOKNAV",
    logo: "/assets/toknav-logo-blue.png",
    favicon: "/favicon.ico",
    defaultSeoTitle: "TOKNAV | GNSS Receivers & RTK Solutions Manufacturer",
    defaultSeoDescription:
      "TOKNAV manufactures GNSS receivers, RTK systems, antennas, CORS/VRS solutions, precision agriculture and machine control products for global B2B buyers.",
    socialLinks: {
      facebook: "https://www.facebook.com/tiganu.eugen1/",
      instagram: "https://www.instagram.com/tiganueugen/",
      linkedin: "https://md.linkedin.com/in/tiganueugeniu",
      youtube: "https://www.youtube.com/@Toknav2024"
    },
    contactEmail: PRIMARY_CONTACT_EMAIL,
    contactEmailSecondary: SALES_CONTACT_EMAIL,
    contactPhone: CONTACT_PHONE,
    whatsappPhone: WHATSAPP_PHONE,
    footerText: "High-precision GNSS positioning solutions for a smarter world.",
    updatedAt: nowIso()
  };
}

export function getDefaultCmsData(): CmsData {
  return {
    version: 1,
    updatedAt: nowIso(),
    pages: [],
    blogPosts: [],
    products: [],
    media: [],
    settings: getDefaultSettings()
  };
}

export function getDefaultAuthStore(): CmsAuthStore {
  return {
    version: 1,
    updatedAt: nowIso(),
    users: []
  };
}

export function ensureCmsDataShape(data: Partial<CmsData> | null | undefined): CmsData {
  const defaults = getDefaultCmsData();
  return {
    version: Number(data?.version || defaults.version),
    updatedAt: data?.updatedAt || defaults.updatedAt,
    pages: Array.isArray(data?.pages) ? data.pages : [],
    blogPosts: Array.isArray(data?.blogPosts) ? data.blogPosts : [],
    products: Array.isArray(data?.products) ? data.products : [],
    media: Array.isArray(data?.media) ? data.media : [],
    settings: {
      ...defaults.settings,
      ...(data?.settings || {}),
      socialLinks: {
        ...defaults.settings.socialLinks,
        ...(data?.settings?.socialLinks || {})
      }
    }
  };
}

export function ensureAuthStoreShape(data: Partial<CmsAuthStore> | null | undefined): CmsAuthStore {
  const defaults = getDefaultAuthStore();
  return {
    version: Number(data?.version || defaults.version),
    updatedAt: data?.updatedAt || defaults.updatedAt,
    users: Array.isArray(data?.users) ? data.users : []
  };
}
