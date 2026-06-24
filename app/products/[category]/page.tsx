import { ArrowRight, FileText, Layers3, Search } from "lucide-react";
import { notFound } from "next/navigation";
import CmsBlocksRenderer from "../../components/CmsBlocksRenderer";
import SiteHeader from "../../components/SiteHeader";
import { getBlockData, getPublishedCmsPageByPath } from "../../lib/cms/public";
import { getCategory, getCategoryApplications, getProductsByCategory, productCategories } from "../../lib/products";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return productCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};
  const cmsPage = getPublishedCmsPageByPath(`/products/${category.slug}`);

  return {
    title: cmsPage?.seoTitle || `${category.name} | TOKNAV Product Category`,
    description: cmsPage?.seoDescription || category.description,
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);
  const categoryApplications = getCategoryApplications(category.slug);
  const cmsPage = getPublishedCmsPageByPath(`/products/${category.slug}`);
  const hero = getBlockData(
    cmsPage,
    "hero",
    {
      label: category.kicker,
      title: category.title,
      subtitle: category.description,
      backgroundImage: category.image
    },
    "page-hero"
  );

  return (
    <main>
      <SiteHeader />

      <section className="product-category-hero">
        <div>
          <a className="back-link" href="/products">
            <ArrowRight size={16} className="reverse-icon" /> All Products
          </a>
          <span className="contact-label">{String(hero.label)}</span>
          <h1>{String(hero.title)}</h1>
          <p>{String(hero.subtitle)}</p>
          <div className="product-meta-row">
            <span><Layers3 size={16} /> {categoryProducts.length} products</span>
            <span><FileText size={16} /> Source: {category.sourcePdf}</span>
          </div>
        </div>
        <div className="category-visual-card">
          <img src={String(hero.backgroundImage || category.image)} alt={category.name} />
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />

      {categoryApplications.length > 0 && (
        <section className="category-application-section">
          <div className="product-index-top">
            <div>
              <h2>Application Scenarios</h2>
              <p>Typical buying contexts for this product category, organized for overseas distributors, contractors and system integrators.</p>
            </div>
          </div>
          <div className="category-application-grid">
            {categoryApplications.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
                <span>{item.products}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="product-section">
        <div className="product-index-top">
          <div>
            <h2>{category.name} Lineup</h2>
            <p>{category.buyerIntent}</p>
          </div>
          <a className="secondary-button" href="/inquiry">
            Send Requirements <ArrowRight size={18} />
          </a>
        </div>

        <div className="product-list-grid">
          {categoryProducts.map((product) => (
            <a className="product-list-card" href={`/products/${category.slug}/${product.slug}`} key={product.slug}>
              <div className="product-list-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-list-copy">
                <span>{product.type}</span>
                <h3>{product.name}</h3>
                <p>{product.excerpt}</p>
                <div className="product-mini-specs">
                  {product.highlights.slice(0, 3).map((item) => (
                    <em key={item}>{item}</em>
                  ))}
                </div>
                <strong>
                  View model details <ArrowRight size={16} />
                </strong>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="product-cta-band">
        <Search size={28} />
        <div>
          <strong>Not sure which model fits your project?</strong>
          <span>Send your country, application, quantity and preferred correction method. TOKNAV can recommend a suitable product package.</span>
        </div>
        <a href="/inquiry">Get Recommendation <ArrowRight size={17} /></a>
      </section>
    </main>
  );
}
