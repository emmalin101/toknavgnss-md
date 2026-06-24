import { ArrowRight, BookOpen, Boxes, CheckCircle2 } from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import SiteHeader from "../components/SiteHeader";
import { getBlockData, getPublishedCmsPageByPath } from "../lib/cms/public";
import { getAllProducts, productCategories } from "../lib/products";

const fallbackHero = {
  label: "Product Center",
  title: "TOKNAV Product Categories for High-Precision Positioning",
  subtitle:
    "Browse product lines from TOKNAV brochures and website structure: GNSS receivers, rugged controllers, antennas, precision agriculture, accessories and complete GNSS application solutions.",
  buttonText: "Get a Quote",
  buttonLink: "/inquiry"
};

export default function ProductsPage() {
  const allProducts = getAllProducts();
  const cmsPage = getPublishedCmsPageByPath("/products");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");

  return (
    <main>
      <SiteHeader />

      <section className="product-hero">
        <div>
          <span className="contact-label">{String(hero.label)}</span>
          <h1>{String(hero.title)}</h1>
          <p>{String(hero.subtitle)}</p>
          <div className="product-hero-actions">
            <a className="primary-button" href={String(hero.buttonLink)}>
              {String(hero.buttonText)} <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/contact">
              Contact Sales
            </a>
          </div>
        </div>
        <div className="product-hero-panel">
          <Boxes size={34} />
          <strong>{allProducts.length}+ listed products and solutions</strong>
          <span>Structured from TOKNAV product brochures and product asset folders.</span>
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />

      <section className="product-section">
        <div className="product-category-grid">
          {productCategories.map((category) => {
            const count = allProducts.filter((item) => item.categorySlug === category.slug).length;
            return (
              <a className="product-category-card" href={`/products/${category.slug}`} key={category.slug}>
                <div className="product-card-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <span>{category.kicker}</span>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <div className="product-card-footer">
                  <strong>{count} items</strong>
                  <em>View category <ArrowRight size={16} /></em>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="product-proof-band">
        <div>
          <CheckCircle2 size={24} />
          <strong>Distributor support</strong>
          <span>Suitable for regional dealers and project partners.</span>
        </div>
        <div>
          <CheckCircle2 size={24} />
          <strong>Brochure-based data</strong>
          <span>Product names and categories follow TOKNAV catalog content.</span>
        </div>
        <div>
          <BookOpen size={24} />
          <strong>Clear inquiry path</strong>
          <span>Each product page links to quotation and project consultation.</span>
        </div>
      </section>
    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/products");
  return {
    title: cmsPage?.seoTitle || "TOKNAV Products | GNSS Receivers, Antennas, Controllers and RTK Solutions",
    description:
      cmsPage?.seoDescription ||
      "Explore TOKNAV GNSS receivers, rugged controllers, GNSS antennas, precision agriculture, machine control, accessories and application solutions.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
