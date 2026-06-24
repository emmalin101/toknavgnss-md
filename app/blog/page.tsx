import Link from "next/link";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import SiteHeader from "../components/SiteHeader";
import { getAllBlogPosts } from "../lib/blogs";
import { getBlockData, getPublishedCmsPageByPath } from "../lib/cms/public";

const fallbackHero = {
  label: "Knowledge Center",
  title: "GNSS, RTK and Precision Positioning Guides for B2B Buyers",
  subtitle:
    "Practical buying guides for overseas distributors, surveying teams, engineering contractors, agriculture dealers and system integrators."
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const cmsPage = getPublishedCmsPageByPath("/blog");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");

  return (
    <main>
      <SiteHeader />

      <section className="blog-hero">
        <div>
          <span className="contact-label" data-i18n="blog.hero.label">{String(hero.label)}</span>
          <h1 data-i18n="blog.hero.title">{String(hero.title)}</h1>
          <p data-i18n="blog.hero.text">{String(hero.subtitle)}</p>
        </div>
        <div className="blog-hero-panel">
          <Sparkles size={30} />
          <strong data-i18n="blog.panel.title">SEO / GEO / AIO Content Layout</strong>
          <span data-i18n="blog.panel.text">
            These articles are written around product selection, technical
            comparison and application questions that overseas buyers actually
            search before sending an inquiry.
          </span>
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />

      <section className="blog-index section">
        <div className="blog-index-top">
          <div className="section-title">
            <h2 data-i18n="blog.latest.title">Latest Buying Guides</h2>
            <p data-i18n="blog.latest.text">
              Start with the receiver selection guide, then move into correction
              infrastructure and vertical application planning.
            </p>
          </div>
          <a className="secondary-button" href="/inquiry">
            <span data-i18n="cta.askCatalog">Ask for Product Catalog</span> <ArrowRight size={18} />
          </a>
        </div>

        <div className="blog-card-grid">
          {posts.map((post) => (
            <Link className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
              <div className="blog-card-meta">
                <span>Priority {post.priority}</span>
                <span>{post.wordCount.toLocaleString()} words</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="blog-card-tags">
                {post.primaryKeyword && <span><Search size={15} />{post.primaryKeyword}</span>}
                {post.searchIntent && <span><BookOpen size={15} />{post.searchIntent}</span>}
              </div>
              <strong>
                <span data-i18n="cta.readArticle">Read article</span> <ArrowRight size={17} />
              </strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/blog");
  return {
    title: cmsPage?.seoTitle || "TOKNAV Blog | GNSS, RTK and Precision Positioning Guides",
    description:
      cmsPage?.seoDescription ||
      "Read TOKNAV guides for RTK GNSS receivers, CORS/VRS correction solutions, precision agriculture and machine control procurement.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
