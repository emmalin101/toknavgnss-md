import { ArrowRight, Boxes, ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteSearch, { type SearchItem } from "./SiteSearch";
import { productCategories, products } from "../lib/products";

const staticSearchItems: SearchItem[] = [
  {
    title: "Home",
    url: "/",
    category: "Page",
    text: "High-precision GNSS receivers and RTK solutions manufacturer."
  },
  {
    title: "About TOKNAV",
    url: "/about",
    category: "Page",
    text: "Company video, product timeline, customer feedback and certificates."
  },
  {
    title: "Blog",
    url: "/blog",
    category: "Resources",
    text: "SEO articles and buying guides for GNSS, RTK and machine control."
  },
  {
    title: "News",
    url: "/news",
    category: "Resources",
    text: "Surveying, GNSS, robotics and mapping industry updates."
  },
  {
    title: "Contact TOKNAV",
    url: "/contact",
    category: "Contact",
    text: "Company address, map and inquiry options."
  },
  {
    title: "Get a Quote",
    url: "/inquiry",
    category: "Inquiry",
    text: "Send project requirements and product inquiry details."
  }
];

export default function SiteHeader() {
  const searchItems: SearchItem[] = [
    ...staticSearchItems,
    ...productCategories.map((category) => ({
      title: category.name,
      url: `/products/${category.slug}`,
      category: "Product Category",
      text: category.buyerIntent
    })),
    ...products.map((product) => ({
      title: product.name,
      url: `/products/${product.categorySlug}/${product.slug}`,
      category: "Product",
      text: product.excerpt
    }))
  ];

  return (
    <header className="site-header">
      <a className="brand" href="/">
        <img src="/assets/toknav-logo-white.png" alt="TOKNAV" />
      </a>
      <nav className="main-nav" aria-label="Primary navigation">
        <details className="mega-nav-item">
          <summary className="mega-nav-trigger">
            Products <ChevronDown size={15} />
          </summary>
          <div className="mega-menu" aria-label="TOKNAV product categories">
            <div className="mega-menu-panel">
              <div className="mega-menu-intro">
                <span>Product Center</span>
                <strong>High-precision GNSS products for B2B projects</strong>
                <p>
                  Compare RTK receivers, controllers, antennas, machine-control
                  systems and complete GNSS application solutions.
                </p>
                <a href="/products">
                  View All Products <ArrowRight size={16} />
                </a>
              </div>
              <div className="mega-menu-grid">
                {productCategories.map((category) => (
                  <a href={`/products/${category.slug}`} key={category.slug}>
                    <img src={category.image} alt="" />
                    <span>{category.kicker}</span>
                    <strong>{category.name}</strong>
                    <em>{category.buyerIntent}</em>
                  </a>
                ))}
              </div>
              <div className="mega-menu-footer">
                <div>
                  <Boxes size={18} />
                  <span>Catalog downloads, model specs and quote support are available on product pages.</span>
                </div>
                <a href="/inquiry">
                  Send Requirements <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </details>
        <a href="/#solutions" data-i18n="nav.solutions">Solutions</a>
        <a href="/about" data-i18n="nav.about">About</a>
        <a href="/blog" data-i18n="nav.blog">Blog</a>
        <a href="/news" data-i18n="nav.news">News</a>
        <a href="/contact" data-i18n="nav.contact">Contact</a>
      </nav>
      <SiteSearch items={searchItems} />
      <LanguageSwitcher />
      <a className="header-cta" href="/inquiry">
        <span data-i18n="cta.getQuote">Get a Quote</span> <ArrowRight size={16} />
      </a>
    </header>
  );
}
