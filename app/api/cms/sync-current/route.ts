import { jsonError, jsonOk, requireAdminApi } from "../../../lib/cms/api";
import { createId, nowIso } from "../../../lib/cms/defaults";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsPage, CmsProduct, CmsProductSpec } from "../../../lib/cms/types";
import { getProductSpecGroups, productCategories, products } from "../../../lib/products";

function pageTemplate(input: {
  title: string;
  slug: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  label?: string;
}) {
  const now = nowIso();
  return {
    id: createId("page"),
    title: input.title,
    slug: input.slug,
    path: input.path,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    ogImage: input.ogImage || input.heroImage || "",
    status: "published",
    blocks: [
      {
        id: createId("block"),
        type: "hero",
        title: "page-hero",
        data: {
          label: input.label || input.title,
          title: input.heroTitle,
          subtitle: input.heroSubtitle,
          backgroundImage: input.heroImage || input.ogImage || "",
          buttonText: "Get a Quote",
          buttonLink: "/inquiry"
        }
      }
    ],
    createdAt: now,
    updatedAt: now
  } satisfies CmsPage;
}

function getDefaultPages() {
  const pages: CmsPage[] = [
    pageTemplate({
      title: "Home",
      slug: "home",
      path: "/",
      seoTitle: "TOKNAV | GNSS Receivers & RTK Solutions Manufacturer",
      seoDescription: "TOKNAV manufactures GNSS receivers, RTK systems, antennas, CORS/VRS solutions, precision agriculture and machine control products for global B2B buyers.",
      ogImage: "/assets/products/gnss-receiver-series-combo.webp",
      heroTitle: "High-Precision GNSS Receivers & RTK Solutions Manufacturer",
      heroSubtitle: "Reliable centimeter-level positioning solutions for surveying, construction, agriculture and industrial applications worldwide.",
      heroImage: "/assets/home-app-construction.jpg",
      label: "TOKNAV GNSS"
    }),
    pageTemplate({
      title: "Products",
      slug: "products",
      path: "/products",
      seoTitle: "TOKNAV Products | GNSS Receivers, Antennas, Controllers and RTK Solutions",
      seoDescription: "Explore TOKNAV GNSS receivers, rugged controllers, GNSS antennas, precision agriculture, machine control, accessories and application solutions.",
      heroTitle: "TOKNAV Product Categories for High-Precision Positioning",
      heroSubtitle: "Browse GNSS receivers, rugged controllers, antennas, precision agriculture, accessories and complete application solutions.",
      heroImage: "/assets/products/gnss-receiver-series-combo.webp",
      label: "Product Center"
    }),
    pageTemplate({
      title: "About",
      slug: "about",
      path: "/about",
      seoTitle: "About TOKNAV | GNSS Receiver Manufacturer, Certifications and Global Customers",
      seoDescription: "Learn about TOKNAV's GNSS product history, latest company video, overseas customer feedback and certification portfolio.",
      heroTitle: "High-Precision GNSS Innovation Built for Global B2B Projects",
      heroSubtitle: "TOKNAV develops GNSS receivers, CORS/VRS systems, rugged controllers, precision agriculture products and application solutions.",
      heroImage: "/assets/customer-visit.jpg",
      label: "About TOKNAV"
    }),
    pageTemplate({
      title: "Contact",
      slug: "contact",
      path: "/contact",
      seoTitle: "Contact TOKNAV | GNSS Receiver Quote and Dealer Cooperation",
      seoDescription: "Contact TOKNAV for GNSS receiver quotation, distributor cooperation, dealer support and technical solution support.",
      heroTitle: "How Can We Help?",
      heroSubtitle: "Reach TOKNAV for product quotation, distributor cooperation, dealer support and technical support.",
      heroImage: "/assets/rtk-rooftop-test.jpg",
      label: "Contact TOKNAV"
    }),
    pageTemplate({
      title: "Inquiry",
      slug: "inquiry",
      path: "/inquiry",
      seoTitle: "Request a GNSS Receiver Quote | TOKNAV",
      seoDescription: "Send your project details to TOKNAV for GNSS receiver, antenna, CORS/VRS, machine control or distributor quotation support.",
      heroTitle: "Request a GNSS Receiver Quote",
      heroSubtitle: "Send your project details and our team will help match the right GNSS product or solution package.",
      heroImage: "/assets/products/gnss-receiver-series-combo.webp",
      label: "B2B Inquiry"
    }),
    pageTemplate({
      title: "Blog",
      slug: "blog",
      path: "/blog",
      seoTitle: "TOKNAV Blog | GNSS, RTK and Precision Positioning Guides",
      seoDescription: "Read TOKNAV guides for RTK GNSS receivers, CORS/VRS correction solutions, precision agriculture and machine control procurement.",
      heroTitle: "GNSS, RTK and Precision Positioning Guides for B2B Buyers",
      heroSubtitle: "Practical buying guides for overseas distributors, surveying teams, engineering contractors and system integrators.",
      heroImage: "/assets/products/t50pro.webp",
      label: "Knowledge Center"
    }),
    pageTemplate({
      title: "News",
      slug: "news",
      path: "/news",
      seoTitle: "TOKNAV News | GNSS and Geospatial Industry Updates",
      seoDescription: "Read concise GNSS, RTK, surveying, GIS, LiDAR, USV and machine-control industry updates from TOKNAV.",
      heroTitle: "GNSS and Geospatial Industry Updates",
      heroSubtitle: "Short, easy-to-read updates for surveying, mapping, construction, machine control and positioning buyers.",
      heroImage: "/assets/products/tsr20.webp",
      label: "News"
    })
  ];

  for (const category of productCategories) {
    pages.push(
      pageTemplate({
        title: category.name,
        slug: `products-${category.slug}`,
        path: `/products/${category.slug}`,
        seoTitle: `${category.name} | TOKNAV Product Category`,
        seoDescription: category.description,
        heroTitle: category.title,
        heroSubtitle: category.description,
        heroImage: category.image,
        label: category.kicker
      })
    );
  }

  return pages;
}

function flattenSpecs(product: (typeof products)[number]) {
  const seen = new Set<string>();
  const specs: CmsProductSpec[] = [];
  for (const group of getProductSpecGroups(product)) {
    for (const spec of group.specs) {
      const key = `${spec.label}:${spec.value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      specs.push(spec);
    }
  }
  return specs;
}

function productTemplate(product: (typeof products)[number]) {
  const now = nowIso();
  const specs = flattenSpecs(product);
  return {
    id: createId("product"),
    name: product.name,
    slug: product.slug,
    type: product.type,
    summary: product.excerpt,
    description: product.excerpt,
    price: "",
    image: product.image,
    gallery: product.gallery?.length ? product.gallery : [product.image],
    category: product.categorySlug,
    tags: [product.type, ...product.applications].filter(Boolean),
    applications: product.applications,
    highlights: product.highlights,
    specs,
    status: "published",
    featured: false,
    seoTitle: `${product.name} Specs, Datasheet and Quote | TOKNAV`,
    seoDescription: product.excerpt,
    createdAt: now,
    updatedAt: now
  } satisfies CmsProduct;
}

export async function POST() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  const pages = getDefaultPages();
  const productsToSync = products.map(productTemplate);

  let pagesAdded = 0;
  let productsAdded = 0;
  let productsUpdated = 0;

  for (const page of pages) {
    const existing = data.pages.find((item) => item.path === page.path || item.slug === page.slug);
    if (!existing) {
      data.pages.push(page);
      pagesAdded += 1;
    }
  }

  for (const product of productsToSync) {
    const index = data.products.findIndex((item) => item.category === product.category && item.slug === product.slug);
    if (index < 0) {
      data.products.push(product);
      productsAdded += 1;
      continue;
    }

    const existing = data.products[index];
    data.products[index] = {
      ...product,
      ...existing,
      id: existing.id,
      type: existing.type || product.type,
      summary: existing.summary || product.summary,
      description: existing.description || product.description,
      image: existing.image || product.image,
      gallery: existing.gallery?.length ? existing.gallery : product.gallery,
      tags: existing.tags?.length ? existing.tags : product.tags,
      applications: existing.applications?.length ? existing.applications : product.applications,
      highlights: existing.highlights?.length ? existing.highlights : product.highlights,
      specs: existing.specs?.length ? existing.specs : product.specs,
      status: existing.status === "published" ? "published" : product.status,
      updatedAt: nowIso()
    };
    productsUpdated += 1;
  }

  await writeCmsData(data, "Sync current website pages and products into CMS");
  return jsonOk({ pagesAdded, productsAdded, productsUpdated });
}
