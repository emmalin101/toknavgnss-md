import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const now = new Date().toISOString();

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function slugify(value, fallback = "item") {
  const slug = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function extractField(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`\\*\\*${escaped}:\\*\\*\\s*(.+)`));
  return match?.[1]?.replace(/^`|`$/g, "").trim() || "";
}

function extractH1(markdown) {
  const h1Section = markdown.match(/## H1\n\n(.+?)(\n\n|$)/);
  if (h1Section?.[1]) return h1Section[1].trim();
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  return firstHeading?.[1]?.replace(/^Blog \d+:\s*/, "").trim() || "TOKNAV Blog";
}

function extractExcerpt(markdown) {
  const intro = markdown.match(/## Introduction\n\n([\s\S]+?)(\n##\s|$)/);
  const text = (intro?.[1] || markdown).replace(/[#*_`>-]/g, "").replace(/\s+/g, " ").trim();
  return text.length > 240 ? `${text.slice(0, 240).trim()}...` : text;
}

function extractBody(markdown) {
  const start = markdown.indexOf("## Introduction");
  const publicContent = start >= 0 ? markdown.slice(start) : markdown;
  return publicContent
    .replace(/\n## Image Plan and AI Image Prompts[\s\S]*$/m, "")
    .replace(/\n## CTA and Popup Plan[\s\S]*$/m, "")
    .trim();
}

function seedBlogs() {
  const blogDir = path.join(root, "content", "blogs");
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((file) => /^[0-9].+\.md$/.test(file) && file !== "00-seo-aio-blog-topic-plan.md")
    .map((file, index) => {
      const markdown = fs.readFileSync(path.join(blogDir, file), "utf8");
      const title = extractH1(markdown);
      const slug = slugify(extractField(markdown, "URL Slug").replace(/^\/blog\//, "") || file.replace(/\.md$/, ""));
      const body = extractBody(markdown);
      return {
        id: id("blog"),
        title,
        slug,
        summary: extractExcerpt(markdown),
        body,
        coverImage: "",
        category: "GNSS",
        tags: [extractField(markdown, "Primary Keyword")].filter(Boolean),
        seoTitle: extractField(markdown, "SEO Title") || title,
        seoDescription: extractField(markdown, "Meta Description") || extractExcerpt(markdown),
        publishedAt: now,
        author: "TOKNAV",
        status: "published",
        createdAt: now,
        updatedAt: now,
        priority: index + 1
      };
    });
}

function seedProducts() {
  const sourcePath = path.join(root, "app", "lib", "products.ts");
  if (!fs.existsSync(sourcePath)) return [];
  const source = fs.readFileSync(sourcePath, "utf8");
  const matches = source.matchAll(
    /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*categorySlug:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)"/g
  );
  return Array.from(matches).slice(0, 60).map((match) => ({
    id: id("product"),
    slug: match[1],
    name: match[2],
    category: match[3],
    tags: [match[4]],
    image: match[5],
    summary: match[6],
    description: match[6],
    price: "",
    gallery: match[5] ? [match[5]] : [],
    specs: [],
    status: "draft",
    featured: false,
    seoTitle: `${match[2]} Specs, Datasheet and Quote | TOKNAV`,
    seoDescription: match[6],
    createdAt: now,
    updatedAt: now
  }));
}

const data = {
  version: 1,
  updatedAt: now,
  pages: [
    {
      id: id("page"),
      title: "Home",
      slug: "home",
      path: "/",
      seoTitle: "TOKNAV | GNSS Receivers & RTK Solutions Manufacturer",
      seoDescription:
        "TOKNAV manufactures GNSS receivers, RTK systems, antennas, CORS/VRS solutions, precision agriculture and machine control products for global B2B buyers.",
      ogImage: "/assets/gnss-receiver-homepage-banner-original.png",
      status: "published",
      blocks: [
        {
          id: id("block"),
          type: "hero",
          title: "home-hero",
          data: {
            title: "High-Precision GNSS Receivers & RTK Solutions Manufacturer",
            subtitle:
              "Reliable centimeter-level positioning solutions for surveying, construction, agriculture and industrial applications worldwide.",
            buttonText: "Get a Quote",
            buttonLink: "/inquiry",
            secondaryButtonText: "Explore Products",
            secondaryButtonLink: "/products",
            backgroundImage: "/assets/gnss-receiver-homepage-banner-original.png"
          }
        },
        {
          id: id("block"),
          type: "cta",
          title: "home-cta",
          data: {
            title: "Need a GNSS Solution?",
            description:
              "Tell us your product, quantity, country and application. TOKNAV will recommend a practical quote package.",
            buttonText: "Get a Quote",
            buttonLink: "/inquiry",
            secondaryButtonText: "Download Catalog",
            secondaryButtonLink: "/assets/downloads/catalogs/gnss-receiver.pdf"
          }
        }
      ],
      createdAt: now,
      updatedAt: now
    }
  ],
  blogPosts: seedBlogs(),
  products: seedProducts(),
  media: [],
  settings: {
    siteName: "TOKNAV",
    logo: "/assets/toknav-logo-blue.png",
    favicon: "/favicon.ico",
    defaultSeoTitle: "TOKNAV | GNSS Receivers & RTK Solutions Manufacturer",
    defaultSeoDescription:
      "TOKNAV manufactures GNSS receivers, RTK systems, antennas, CORS/VRS solutions, precision agriculture and machine control products for global B2B buyers.",
    socialLinks: {
      facebook: "https://www.facebook.com/Toknavgnss/",
      instagram: "https://www.instagram.com/toknavgnss/",
      linkedin: "https://www.linkedin.com/company/toknav-information-technology/",
      youtube: "https://www.youtube.com/@Toknav2024"
    },
    contactEmail: "emma@toknav.cn",
    footerText: "High-precision GNSS positioning solutions for a smarter world.",
    updatedAt: now
  }
};

const outputPath = path.join(root, "content", "cms-data.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Seeded CMS data: ${outputPath}`);
