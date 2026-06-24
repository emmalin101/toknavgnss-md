export type CmsStatus = "draft" | "published";

export type CmsBlockType = "hero" | "rich_text" | "image" | "gallery" | "cta" | "faq" | "custom";

export type CmsBlock = {
  id: string;
  type: CmsBlockType;
  title?: string;
  data: Record<string, unknown>;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  status: CmsStatus;
  blocks: CmsBlock[];
  createdAt: string;
  updatedAt: string;
};

export type CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  coverImage: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  author: string;
  status: CmsStatus;
  createdAt: string;
  updatedAt: string;
};

export type CmsProductSpec = {
  label: string;
  value: string;
};

export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  type: string;
  summary: string;
  description: string;
  price: string;
  image: string;
  gallery: string[];
  category: string;
  tags: string[];
  applications: string[];
  highlights: string[];
  specs: CmsProductSpec[];
  status: CmsStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsMediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsSettings = {
  siteName: string;
  logo: string;
  favicon: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  contactEmail: string;
  contactEmailSecondary: string;
  contactPhone: string;
  whatsappPhone: string;
  footerText: string;
  updatedAt: string;
};

export type CmsData = {
  version: number;
  updatedAt: string;
  pages: CmsPage[];
  blogPosts: CmsBlogPost[];
  products: CmsProduct[];
  media: CmsMediaItem[];
  settings: CmsSettings;
};

export type CmsAdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsAuthStore = {
  version: number;
  updatedAt: string;
  users: CmsAdminUser[];
};

export const blockTypeLabels: Record<CmsBlockType, string> = {
  hero: "Hero",
  rich_text: "Rich Text",
  image: "Image",
  gallery: "Gallery",
  cta: "CTA",
  faq: "FAQ",
  custom: "Custom JSON"
};
