import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Construction,
  Globe2,
  Headset,
  Layers3,
  MapPinned,
  Sprout,
  UsersRound,
  Waves
} from "lucide-react";
import type { CSSProperties, ElementType } from "react";
import InquiryForm from "./components/InquiryForm";
import SiteHeader from "./components/SiteHeader";
import { resolveDownloadHref } from "./lib/assetUrls";
import { getBlockData, getCmsSettings, getPublishedCmsPageByPath } from "./lib/cms/public";
import { productCategories } from "./lib/products";

const heroProducts = [
  { title: "T50Pro", href: "/products/gnss-receivers/t50pro", image: "/assets/products/t50pro.webp" },
  { title: "TR10Pro", href: "/products/gnss-application-solutions/marking-robot", image: "/assets/products/tr10pro-marking-robot-front.png" },
  { title: "U6", href: "/products/gnss-application-solutions/deformation-monitoring", image: "/assets/products/u6.webp" }
];

const whyItems = [
  { title: "Product Configuration Support", text: "Flexible kits, accessories and field-ready packages to support your market growth.", icon: BadgeCheck },
  { title: "15+ Years R&D Experience", text: "Continuous innovation in GNSS algorithms, hardware design and software platforms.", icon: BadgeCheck },
  { title: "60%+ Engineers", text: "A strong R&D team dedicated to high-precision positioning technology.", icon: UsersRound },
  { title: "Global Project Support", text: "Localized technical support and after-sales service across key regions worldwide.", icon: Globe2 }
];

const applications = [
  { title: "Land Surveying & Mapping", href: "/products/gnss-receivers", image: "/assets/home-app-survey.jpg", icon: "survey" },
  { title: "Construction & Engineering", href: "/products/gnss-receivers", image: "/assets/home-app-construction.jpg", icon: "construction" },
  { title: "Precision Agriculture", href: "/products/precision-agriculture-machine-control", image: "/assets/home-app-agriculture.jpg", icon: "agriculture" },
  { title: "Machine Control", href: "/products/precision-agriculture-machine-control", image: "/assets/home-app-machine.jpg", icon: "machine" },
  { title: "Monitoring & Deformation", href: "/products/gnss-application-solutions", image: "/assets/home-app-monitoring.jpg", icon: "monitoring" },
  { title: "GIS Data Collection", href: "/products/rugged-gis", image: "/assets/home-app-gis.jpg", icon: "gis" }
];

const trustedMetrics = [
  { value: "100+", label: "Countries & Regions", icon: "global" },
  { value: "15+", label: "Years of Innovation", icon: "building" },
  { value: "60%+", label: "R&D Engineers", icon: "team" },
  { value: "24/7", label: "Global Support", icon: "support" }
];

const homeFaqs = [
  {
    question: "What accuracy can TOKNAV GNSS receivers achieve?",
    answer: "TOKNAV RTK receivers are designed for centimeter-level positioning when used with suitable correction data, good satellite visibility and correct field setup."
  },
  {
    question: "Do you support distributor-ready product configuration?",
    answer: "Yes. TOKNAV supports kit configuration, accessory matching, product packaging and documentation for distributors and project partners."
  },
  {
    question: "What is the warranty and after-sales support?",
    answer: "Warranty and support terms depend on product model and order plan. Our team can provide datasheets, test guidance and remote technical support."
  },
  {
    question: "Which industries are your products suitable for?",
    answer: "TOKNAV products are used in surveying, mapping, construction, precision agriculture, machine control, monitoring, GIS and solution integration."
  }
];

const fallbackHero = {
  title: "High-Precision GNSS Receivers & RTK Solutions Manufacturer",
  subtitle: "Reliable centimeter-level positioning solutions for surveying, construction, agriculture and industrial applications worldwide.",
  buttonText: "Get a Quote",
  buttonLink: "/inquiry",
  secondaryButtonText: "Explore Products",
  secondaryButtonLink: "/products",
  backgroundImage: "/assets/gnss-receiver-homepage-banner-original.png"
};

const fallbackCta = {
  title: "Need a GNSS Solution?",
  description: "Tell us your product, quantity, country and application. TOKNAV will recommend a practical quote package.",
  buttonText: "Get a Quote",
  buttonLink: "/inquiry",
  secondaryButtonText: "Download Catalog",
  secondaryButtonLink: "/assets/downloads/catalogs/gnss-receiver.pdf"
};

const fallbackCategories = productCategories.map((category) => ({
  title: category.name,
  href: `/products/${category.slug}`,
  image: category.image
}));

const fallbackTrusted = {
  title: "Trusted by Professionals Around the World",
  description: "TOKNAV products are widely used in more than 100 countries and regions, helping clients improve efficiency and accuracy in every project.",
  buttonText: "Learn More About Us",
  buttonLink: "/about",
  backgroundImage: "/assets/customer-visit.jpg",
  metrics: trustedMetrics
};

const applicationIconMap: Record<string, ElementType> = {
  survey: MapPinned,
  construction: Construction,
  agriculture: Sprout,
  machine: Waves,
  monitoring: Headset,
  gis: Layers3
};

const metricIconMap: Record<string, ElementType> = {
  global: Globe2,
  building: Building2,
  team: UsersRound,
  support: Headset
};

type HomeImageItem = {
  title?: string;
  href?: string;
  image?: string;
  icon?: string;
  value?: string;
  label?: string;
};

function normalizeItems(value: unknown, fallback: HomeImageItem[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const title = String(record.title || record.name || record.label || "").trim();
      const href = String(record.href || record.link || "").trim();
      const image = String(record.image || "").trim();
      const icon = String(record.icon || "").trim();
      const value = String(record.value || "").trim();
      const label = String(record.label || title).trim();
      if (!title && !label && !value) return null;
      return { title, href, image, icon, value, label };
    })
    .filter(Boolean) as HomeImageItem[];
  return items.length ? items : fallback;
}

function HomeSectionTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div className="home-section-title compact">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export default function Home() {
  const cmsPage = getPublishedCmsPageByPath("/");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "home-hero");
  const cta = getBlockData(cmsPage, "cta", fallbackCta, "home-cta");
  const categoryBlock = getBlockData(cmsPage, "custom", { items: fallbackCategories }, "home-product-categories");
  const heroProductBlock = getBlockData(cmsPage, "custom", { items: heroProducts }, "home-hero-products");
  const applicationBlock = getBlockData(cmsPage, "custom", { items: applications }, "home-applications");
  const trusted = getBlockData(cmsPage, "custom", fallbackTrusted, "home-trusted-band");
  const heroImage = String(hero.backgroundImage || fallbackHero.backgroundImage);
  const categoryItems = normalizeItems(categoryBlock.items, fallbackCategories);
  const heroProductItems = normalizeItems(heroProductBlock.items, heroProducts).slice(0, 3);
  const applicationItems = normalizeItems(applicationBlock.items, applications);
  const trustedMetricsItems = normalizeItems(trusted.metrics, trustedMetrics as HomeImageItem[]);
  const trustedBackground = String(trusted.backgroundImage || fallbackTrusted.backgroundImage);
  const heroStyle = {
    "--home-hero-bg": `url("${heroImage}")`
  } as CSSProperties;
  const trustedStyle = {
    background: `linear-gradient(90deg, rgba(6,29,74,.94), rgba(7,43,105,.82)), url("${trustedBackground}") center / cover no-repeat`
  } as CSSProperties;

  return (
    <main className="home-page">
      <SiteHeader />

      <section className="home-hero simple" style={heroStyle}>
        <div className="home-hero-copy">
          <h1>{String(hero.title)}</h1>
          <p>{String(hero.subtitle)}</p>
          <div className="home-hero-actions">
            <a className="home-primary-button" href={String(hero.buttonLink)}>
              {String(hero.buttonText)} <ArrowRight size={18} />
            </a>
            <a className="home-secondary-button" href={String(hero.secondaryButtonLink)}>
              {String(hero.secondaryButtonText)} <ChevronRight size={18} />
            </a>
          </div>
          <div className="home-hero-proof mini">
            <span>Dealer Support</span>
            <span>15+ Years R&D</span>
            <span>60%+ Engineers</span>
            <span>Global Support</span>
          </div>
        </div>
        <div className="home-hero-stage" aria-label="Featured TOKNAV products">
          <div className="home-hero-carousel">
            {heroProductItems.map((item, index) => (
              <a
                className="home-hero-slide"
                href={item.href || "#products"}
                key={item.title || item.image}
                style={{ "--slide-delay": `${index * 4}s` } as CSSProperties}
              >
                <img src={item.image} alt={item.title || "TOKNAV product"} />
                <span>
                  <strong>{item.title}</strong>
                  <small>View product details</small>
                </span>
              </a>
            ))}
          </div>
          <div className="home-hero-carousel-dots" aria-hidden="true">
            {heroProductItems.map((item, index) => (
              <span
                key={`${item.title || item.image}-dot`}
                style={{ "--dot-delay": `${index * 4}s` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-products compact" id="products">
        <HomeSectionTitle title="Our Product Categories" text="Professional GNSS and positioning solutions for diverse industries and applications." />
        <div className="home-category-grid compact">
          {categoryItems.map((category) => (
            <a href={category.href || "/products"} className="home-category-card compact" key={category.title || category.href}>
              <img src={category.image} alt={category.title || "TOKNAV product category"} />
              <h3>{category.title}</h3>
              <strong>View More <ChevronRight size={15} /></strong>
            </a>
          ))}
        </div>
      </section>

      <section className="home-section home-why">
        <HomeSectionTitle title="Why Choose TOKNAV" text="Built on innovation. Backed by experience. Trusted worldwide." />
        <div className="home-why-grid">
          {whyItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <Icon size={32} strokeWidth={1.8} />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-applications" id="solutions">
        <HomeSectionTitle title="Applications" text="High-precision positioning empowers a wide range of industries." />
        <div className="home-application-strip">
          {applicationItems.map((item) => {
            const Icon = applicationIconMap[item.icon || ""] || MapPinned;
            return (
              <a href={item.href || "/products"} key={item.title || item.href}>
                <img src={item.image} alt={item.title || "TOKNAV application"} />
                <span>
                  <Icon size={42} strokeWidth={1.7} />
                  <strong>{item.title}</strong>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="home-trusted-band" id="about" style={trustedStyle}>
        <div>
          <h2>{String(trusted.title)}</h2>
          <p>{String(trusted.description)}</p>
          <a href={String(trusted.buttonLink)}>{String(trusted.buttonText)}</a>
        </div>
        <div className="home-trusted-metrics">
          {trustedMetricsItems.map((item) => {
            const Icon = metricIconMap[item.icon || ""] || Globe2;
            return (
              <strong key={`${item.value}-${item.label}`}>
                <Icon size={48} strokeWidth={1.6} />
                {item.value}
                <span>{item.label}</span>
              </strong>
            );
          })}
        </div>
      </section>

      <section className="home-faq-inquiry" id="contact">
        <div className="home-faq-panel">
          <h2>FAQ</h2>
          <div className="home-faq-list">
            {homeFaqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span>+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <a className="home-download-card" href={resolveDownloadHref(String(cta.secondaryButtonLink))}>
            <Layers3 size={36} />
            <span>
              <strong>Download Product Catalog</strong>
              <small>Get the latest product brochure and technical information.</small>
            </span>
          </a>
        </div>

        <div className="home-quote-panel">
          <h2>Get a Quote</h2>
          <p>Tell us about your project needs. Our team will respond within 24 hours.</p>
          <InquiryForm />
        </div>
      </section>

    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/");
  const settings = getCmsSettings();
  return {
    title: cmsPage?.seoTitle || settings.defaultSeoTitle,
    description: cmsPage?.seoDescription || settings.defaultSeoDescription,
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
