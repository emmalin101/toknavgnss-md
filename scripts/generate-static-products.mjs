import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();

function loadProductModule() {
  const sourcePath = path.join(root, "app/lib/products.ts");
  let source = fs.readFileSync(sourcePath, "utf8");

  source = source
    .replace(/export type [\s\S]*?};\n\n/g, "")
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ")
    .replace(/: ProductCategory\[\]/g, "")
    .replace(/: Product\[\]/g, "")
    .replace(/: ProductSpec\[\]/g, "")
    .replace(/: ProductSpecGroup\[\]/g, "")
    .replace(/: Record<string, ProductDownload>/g, "")
    .replace(/: Record<string, ProductDatasheet>/g, "")
    .replace(/: Record<string, \{ title: string; text: string; products: string \}\[\]>/g, "")
    .replace(/: Record<string, ProductSpecGroup\[\]>/g, "")
    .replace(/: Record<string, ProductSpecGroup\[\]\>/g, "")
    .replace(/: string/g, "")
    .replace(/: Product/g, "")
    .replace(/\)([A-Za-z][A-Za-z0-9_]*)\[\]/g, ")")
    .replace(/\(([^()]*?): string([^()]*)\)/g, "($1$2)")
    .replace(/\(([^()]*?): Product([^()]*)\)/g, "($1$2)");

  source += `
globalThis.__toknavProducts = {
  productCategories,
  products,
  getCategory,
  getProductsByCategory,
  getCategoryApplications,
  getProduct,
  getProductSpecGroups,
  getProductInquiryUrl,
  getProductDownloads,
  getProductDatasheet,
  getProductQuickSpecs,
  getProductGallery,
  getProductBuyerBenefits,
  getProductSeoTitle,
  getProductMetaDescription,
  getProductFaqs
};`;

  const context = {
    globalThis: {},
    URLSearchParams
  };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });
  return context.globalThis.__toknavProducts;
}

const {
  productCategories,
  products,
  getProductsByCategory,
  getCategoryApplications,
  getProductSpecGroups,
  getProductDownloads,
  getProductDatasheet,
  getProductQuickSpecs,
  getProductGallery,
  getProductBuyerBenefits,
  getProductSeoTitle,
  getProductMetaDescription,
  getProductFaqs
} = loadProductModule();

const css = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
const socialLinks = JSON.parse(fs.readFileSync(path.join(root, "public/assets/social-links.json"), "utf8"));
const youtubeUploadsEmbed = "https://www.youtube.com/embed/videoseries?list=UU7YvmJlQYioSnNjsoxlBPxQ";
const aboutTimeline = [
  ["2020", "GNSS RTK T5", "TOKNAV introduced the T5 RTK receiver line for practical field surveying."],
  ["2022.4", "T10Pro", "T10Pro joined the GNSS receiver portfolio for professional survey and mapping work."],
  ["2022.6", "VRS CORS NET660i", "NET660i expanded TOKNAV correction-service and CORS infrastructure capability."],
  ["2022.11", "U6 Deformation Monitoring", "U6 was released for monitoring scenarios such as structures, slopes and long-term displacement projects."],
  ["2023.3", "T20Pro", "T20Pro strengthened TOKNAV's receiver family for higher-performance RTK applications."],
  ["2023.8", "P8 / P8Pro", "Rugged GIS controllers were added to support integrated field data workflows."],
  ["2023.11", "Marking Robot", "TOKNAV launched its robotic marking solution for automated line marking projects."],
  ["2024.2", "tBase", "tBase was introduced for compact base station and RTK correction work."],
  ["2024.3", "P8Global", "P8Global expanded portable GNSS and GIS data collection options."],
  ["2024.5", "NET660", "NET660 strengthened the CORS and base-station receiver range."],
  ["2024.7", "T30 / T30Pro / NET660i-1U", "T30 and T30Pro brought AR stakeout, laser measurement and photogrammetry options, while NET660i-1U supported rack-mounted CORS deployment."],
  ["2025.1", "TAG66", "The electric steering wheel autonomous driving system expanded TOKNAV's agriculture automation line."],
  ["2025.2", "TAG88 / TMC10 / TMC20 / T40 Series", "TOKNAV continued its agriculture and machine-control product expansion with land leveling, dozer guidance, excavator guidance and T40 Series receivers."],
  ["2025.8", "Unmanned Surface Vehicle", "TOKNAV extended high-precision positioning into unmanned water-surface survey scenarios."],
  ["2025.10", "T50 Series", "The T50 Series was added to the receiver roadmap for updated RTK project requirements."],
  ["2025.11", "TSR20 Handheld LiDAR Scanner", "TOKNAV added handheld LiDAR scanning for spatial data capture and mapping workflows."],
  ["2026.1", "Terrestrial Laser Scanner", "TOKNAV's roadmap expanded toward terrestrial laser scanning for professional geospatial projects."]
];
const aboutFeedbackPhotos = [
  ["/assets/about/feedback-las-vegas-demo.webp", "Product demonstration at a Las Vegas exhibition booth"],
  ["/assets/about/feedback-las-vegas-talk.webp", "Customer discussion around TOKNAV GNSS solutions"],
  ["/assets/about/feedback-las-vegas-booth.webp", "Overseas visitors reviewing TOKNAV products"],
  ["/assets/about/feedback-las-vegas-field.webp", "TR10 Pro field-marking demonstration with customers"],
  ["/assets/about/feedback-las-vegas-group.webp", "Customer meeting at TOKNAV booth"],
  ["/assets/about/feedback-russia-group.webp", "Partner feedback at Russia CTT Expo"],
  ["/assets/about/feedback-saudi-storefront.webp", "TOKNAV partner storefront in Saudi Arabia"],
  ["/assets/about/feedback-cameroon-office.webp", "Customer office display with TOKNAV equipment"],
  ["/assets/about/feedback-las-vegas-robot-demo.webp", "Visitors watching TOKNAV robot demonstration in Las Vegas"],
  ["/assets/about/feedback-las-vegas-visitors.webp", "Overseas customers visiting the TOKNAV exhibition booth"],
  ["/assets/about/feedback-las-vegas-usv-talk.webp", "Customer discussion beside TOKNAV USV and GNSS products"],
  ["/assets/about/feedback-las-vegas-booth-crowd.webp", "Busy exhibition booth with international visitors"],
  ["/assets/about/feedback-las-vegas-slam-demo.webp", "TOKNAV SLAM and GNSS product demonstration"],
  ["/assets/about/feedback-las-vegas-display.webp", "TOKNAV product display at overseas exhibition"],
  ["/assets/about/feedback-russia-outdoor-booth.webp", "TOKNAV booth at Russia CTT Expo outdoor area"],
  ["/assets/about/feedback-russia-field-demo.webp", "Field demonstration at Russia construction exhibition"],
  ["/assets/about/feedback-factory-customer-visit.webp", "Customers visiting TOKNAV product demo room"],
  ["/assets/about/feedback-factory-training.webp", "Product training session with visiting customers"],
  ["/assets/about/feedback-factory-handshake.webp", "Customer cooperation discussion at TOKNAV office"],
  ["/assets/about/feedback-factory-demo-table.webp", "Product demo table prepared for customer visit"]
];
const aboutCertificates = [
  ["/assets/about/cert-ce-p8.webp", "CE certificate for P8 series"],
  ["/assets/about/cert-ce-t10pro.webp", "CE certificate for T10Pro"],
  ["/assets/about/cert-fcc-t30.webp", "FCC grant for T30 series"],
  ["/assets/about/cert-igs-t10pro.webp", "IGS certification for T10Pro"],
  ["/assets/about/cert-ngs.webp", "NGS calibration certificate"],
  ["/assets/about/cert-kc.webp", "KC certification"],
  ["/assets/about/cert-iso9001.webp", "ISO9001 company certificate"]
];

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(value) {
  return esc(value).replace(/'/g, "&#39;");
}

function relAsset(src, depth) {
  const clean = src.replace(/^\//, "");
  return `${"../".repeat(depth)}public/${clean}`;
}

function relDownload(href, depth) {
  if (href.startsWith("/inquiry?")) {
    return `${"../".repeat(depth)}inquiry.html${href.slice("/inquiry".length)}`;
  }
  const clean = href.replace(/^\//, "");
  return `${"../".repeat(depth)}public/${clean}`;
}

function socialIcon(platform) {
  if (platform === "Facebook") {
    return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.45 8.58V6.9c0-.72.18-1.08 1.16-1.08h1.44V3.02h-2.3c-2.76 0-3.73 1.37-3.73 3.68v1.88H8.95v2.88h2.07v8.52h3.43v-8.52h2.3l.31-2.88h-2.61Z"/></svg>`;
  }
  if (platform === "Instagram") {
    return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 2.1a2.7 2.7 0 0 0-2.7 2.7v8.4a2.7 2.7 0 0 0 2.7 2.7h8.4a2.7 2.7 0 0 0 2.7-2.7V7.8a2.7 2.7 0 0 0-2.7-2.7H7.8Zm4.2 3.1a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Zm0 2.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4.15-2.45a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Z"/></svg>`;
  }
  if (platform === "Email") {
    return `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
  }
  return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.65 8.9H3.5v11.1h3.15V8.9ZM5.08 4a1.83 1.83 0 1 0 0 3.66A1.83 1.83 0 0 0 5.08 4Zm14.92 9.85c0-3.02-1.61-4.43-3.76-4.43a3.25 3.25 0 0 0-2.94 1.62V8.9h-3.02v11.1h3.15v-5.49c0-1.45.27-2.86 2.08-2.86 1.78 0 1.81 1.67 1.81 2.95v5.4H20v-6.15Z"/></svg>`;
}

function socialLinksHtml() {
  const links = socialLinks.map((item) => `<a class="social-link social-link-${attr(item.platform.toLowerCase())}" href="${attr(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${attr(item.ariaLabel)}" title="${attr(item.platform)}">${socialIcon(item.platform)}</a>`).join("");
  return `<div class="social-links" aria-label="TOKNAV social media links">${links}</div>`;
}

function footerHtml() {
  return `<footer class="site-footer">
    <div class="site-footer-brand"><strong>TOKNAV</strong><span>High-precision GNSS positioning solutions for a smarter world.</span></div>
    <div class="site-footer-info"><span>Guangzhou Toksurvey Information Technology Co., Ltd.</span><span>No. 9 Caipin Road, Huangpu District, Guangzhou, China</span><span>GNSS Receiver Manufacturer · Professional OEM &amp; ODM</span></div>
    ${socialLinksHtml()}
  </footer>`;
}

function homeIndex() {
  const heroProducts = [
    { name: "T50Pro", href: "products/gnss-receivers/t50pro.html", image: "/assets/products/t50pro.webp" },
    { name: "TR10Pro", href: "products/gnss-application-solutions/marking-robot.html", image: "/assets/products/tr10pro-marking-robot-front.png" },
    { name: "U6 Monitoring System", href: "products/gnss-application-solutions/deformation-monitoring.html", image: "/assets/products/u6.webp" }
  ];
  const whyItems = [
    ["OEM/ODM", "Flexible customization"],
    ["15+ Years R&D", "GNSS experience"],
    ["60%+ Engineers", "Technical support"],
    ["Global Projects", "Export service"]
  ];
  const industries = [
    ["Land Surveying", "products/gnss-receivers/index.html", "/assets/rtk-field-use-1.jpg"],
    ["Construction", "products/gnss-receivers/index.html", "/assets/gnss-receiver-homepage-banner-original.png"],
    ["Precision Agriculture", "products/precision-agriculture-machine-control/index.html", "/assets/products/tag66.webp"],
    ["Machine Control", "products/precision-agriculture-machine-control/index.html", "/assets/products/tmc20.webp"],
    ["Monitoring", "products/gnss-application-solutions/index.html", "/assets/products/u6.webp"],
    ["GIS Data Collection", "products/rugged-gis/index.html", "/assets/products/pcr500.webp"]
  ];
  const sectionTitle = (title, text = "") => `<div class="home-section-title compact"><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ""}</div>`;
  const categoryCards = productCategories.map((category) => `<a href="products/${category.slug}/index.html" class="home-category-card">
      <img src="${relAsset(category.image, 0)}" alt="${attr(category.name)}">
      <h3>${esc(category.name)}</h3>
      <strong>View More ›</strong>
    </a>`).join("");
  const heroProductCards = heroProducts.map((item) => `<a href="${item.href}">
      <img src="${relAsset(item.image, 0)}" alt="${attr(item.name)}">
      <span>${esc(item.name)}</span>
    </a>`).join("");
  const whyHtml = whyItems.map(([title, text]) => `<div><span>◎</span><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join("");
  const industryCards = industries.map(([title, href, image]) => `<a href="${href}">
      <img src="${relAsset(image, 0)}" alt="${attr(title)}">
      <span>${esc(title)}</span>
    </a>`).join("");

  return shell({
    title: "TOKNAV GNSS Receiver Manufacturer | RTK, CORS/VRS and Machine Control Solutions",
    description: "TOKNAV supplies high-precision GNSS receivers, RTK antennas, CORS/VRS systems, precision agriculture and machine-control solutions for global B2B buyers.",
    body: `<section class="home-hero simple">
      <div class="home-hero-copy">
        <h1>High-Precision GNSS Receivers &amp; RTK Solutions Manufacturer</h1>
        <p>Reliable centimeter-level positioning solutions for surveying, construction, agriculture and industrial applications worldwide.</p>
        <div class="home-hero-actions"><a class="home-primary-button" href="inquiry.html">Get a Quote →</a><a class="home-secondary-button" href="products.html">Explore Products ›</a></div>
        <div class="home-hero-proof mini"><span>OEM/ODM</span><span>15+ Years R&amp;D</span><span>60%+ Engineers</span><span>Global Support</span></div>
      </div>
      <div class="home-hero-stage">
        <img class="home-hero-banner-clean" src="public/assets/gnss-receiver-homepage-banner-original.png" alt="TOKNAV GNSS receiver product banner">
        <div class="home-hero-product-row simple">${heroProductCards}</div>
      </div>
    </section>
    <section class="home-section home-products compact" id="products">
      ${sectionTitle("Our Product Categories", "Professional GNSS and positioning solutions for diverse industries and applications.")}
      <div class="home-category-grid compact">${categoryCards}</div>
    </section>
    <section class="home-section home-why">
      ${sectionTitle("Why Choose TOKNAV", "Built on innovation. Backed by experience. Trusted worldwide.")}
      <div class="home-why-grid">${whyHtml}</div>
    </section>
    <section class="home-applications" id="solutions">
      ${sectionTitle("Applications", "High-precision positioning empowers a wide range of industries.")}
      <div class="home-application-strip">${industryCards}</div>
    </section>
    <section class="home-trusted-band" id="about">
      <div><h2>Trusted by Professionals Around the World</h2><p>TOKNAV products support reliable positioning work across surveying, construction, agriculture and monitoring projects.</p><a href="contact.html">Learn More About Us</a></div>
      <div class="home-trusted-metrics">
        <strong>100+<span>Countries &amp; Regions</span></strong>
        <strong>15+<span>Years of Innovation</span></strong>
        <strong>60%+<span>R&amp;D Engineers</span></strong>
        <strong>24/7<span>Global Support</span></strong>
      </div>
    </section>
    <section class="home-section home-cta compact" id="contact">
      <div><h2>Need a GNSS Solution?</h2><p>Tell us your product, quantity, country and application. TOKNAV will recommend a practical quote package.</p></div>
      <div class="home-cta-actions"><a class="home-primary-button" href="inquiry.html">Get a Quote →</a><a class="home-secondary-button" href="public/assets/downloads/catalogs/gnss-receiver.pdf">Download Catalog</a></div>
    </section>`
  });
}

function shell({ title, description, depth = 0, body, schema = "" }) {
  const prefix = "../".repeat(depth);
  const megaGrid = productCategories.map((category) => `<a href="${prefix}products/${category.slug}/index.html">
        <img src="${prefix}public${category.image}" alt="">
        <span>${esc(category.kicker)}</span>
        <strong>${esc(category.name)}</strong>
        <em>${esc(category.buyerIntent)}</em>
      </a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<style>${css}</style>
${schema}
</head>
<body>
<main>
  <header class="site-header">
    <a class="brand" href="${prefix}index.html"><img src="${prefix}public/assets/toknav-logo-blue.png" alt="TOKNAV"></a>
    <nav class="main-nav" aria-label="Primary navigation">
      <details class="mega-nav-item">
        <summary class="mega-nav-trigger">Products <span>⌄</span></summary>
        <div class="mega-menu" aria-label="TOKNAV product categories">
          <div class="mega-menu-panel">
            <div class="mega-menu-intro">
              <span>Product Center</span>
              <strong>High-precision GNSS products for B2B projects</strong>
              <p>Compare RTK receivers, controllers, antennas, machine-control systems and complete GNSS application solutions.</p>
              <a href="${prefix}products.html">View All Products →</a>
            </div>
            <div class="mega-menu-grid">${megaGrid}</div>
            <div class="mega-menu-footer">
              <div><span>▣</span><span>Catalog downloads, model specs and quote support are available on product pages.</span></div>
              <a href="${prefix}inquiry.html">Send Requirements →</a>
            </div>
          </div>
        </div>
      </details>
      <a href="${prefix}index.html#solutions">Solutions</a>
      <a href="${prefix}index.html#oem">OEM/ODM</a>
      <a href="${prefix}about.html">About</a>
      <a href="${prefix}blog.html">Blog</a>
      <a href="${prefix}contact.html">Contact</a>
    </nav>
    <a class="header-cta" href="${prefix}inquiry.html"><span>Get a Quote</span> →</a>
  </header>
${body}
  ${footerHtml()}
</main>
<a aria-label="Contact TOKNAV on WhatsApp" class="whatsapp-float" href="https://wa.me/8619195346957?text=Hello%2C%20I%20am%20interested%20in%20your%20products.%20Please%20send%20me%20more%20details." rel="noopener noreferrer" target="_blank" title="Contact TOKNAV on WhatsApp"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16.02 4.2c-6.45 0-11.7 5.14-11.7 11.46 0 2.18.64 4.29 1.84 6.11L4.2 27.8l6.28-1.91a11.98 11.98 0 0 0 5.54 1.37c6.45 0 11.7-5.14 11.7-11.46S22.47 4.2 16.02 4.2Zm0 20.99c-1.78 0-3.52-.49-5.04-1.42l-.36-.22-3.72 1.13 1.16-3.56-.24-.37a9.33 9.33 0 0 1-1.43-4.95c0-5.18 4.32-9.39 9.63-9.39s9.63 4.21 9.63 9.39-4.32 9.39-9.63 9.39Zm5.29-7.04c-.29-.14-1.71-.83-1.98-.92-.27-.1-.46-.14-.66.14-.19.28-.76.92-.93 1.11-.17.19-.34.21-.63.07-.29-.14-1.22-.44-2.32-1.41-.86-.75-1.44-1.68-1.61-1.96-.17-.28-.02-.43.13-.57.13-.13.29-.33.44-.49.15-.16.19-.28.29-.47.1-.19.05-.35-.02-.49-.07-.14-.66-1.55-.9-2.13-.24-.56-.48-.48-.66-.49h-.56c-.19 0-.51.07-.78.35-.27.28-1.02.98-1.02 2.39s1.05 2.77 1.2 2.96c.15.19 2.07 3.1 5.02 4.34.7.3 1.25.48 1.68.61.71.22 1.35.19 1.86.12.57-.08 1.71-.69 1.95-1.35.24-.66.24-1.23.17-1.35-.07-.12-.27-.19-.56-.33Z"/></svg></a>
<script src="${prefix}public/assets/i18n-static.js?v=20260618c" defer></script>
</body>
</html>`;
}

function productsIndex() {
  const cards = productCategories.map((category) => {
    const count = products.filter((item) => item.categorySlug === category.slug).length;
    return `<a class="product-category-card" href="products/${category.slug}/index.html">
      <div class="product-card-image"><img src="${relAsset(category.image, 0)}" alt="${attr(category.name)}"></div>
      <span>${esc(category.kicker)}</span>
      <h2>${esc(category.name)}</h2>
      <p>${esc(category.description)}</p>
      <div class="product-card-footer"><strong>${count} items</strong><em>View category →</em></div>
    </a>`;
  }).join("");

  return shell({
    title: "TOKNAV Products | GNSS Receivers and RTK Solutions",
    description: "Explore TOKNAV GNSS receivers, antennas, controllers, machine-control systems, accessories and application solutions.",
    body: `<section class="product-hero">
      <div><span class="contact-label">Product Center</span><h1>TOKNAV Product Categories for High-Precision Positioning</h1><p>Browse product lines from TOKNAV brochures: GNSS receivers, rugged controllers, antennas, precision agriculture, accessories and GNSS application solutions.</p><div class="product-hero-actions"><a class="primary-button" href="inquiry.html">Get a Quote →</a><a class="secondary-button" href="contact.html">Contact Sales</a></div></div>
      <div class="product-hero-panel"><strong>${products.length}+ listed products and solutions</strong><span>Structured from TOKNAV product brochures and product asset folders.</span></div>
    </section>
    <section class="product-section"><div class="product-category-grid">${cards}</div></section>`
  });
}

function aboutPage() {
  const timelineHtml = aboutTimeline.map(([date, title, text]) => `<article><div><span>◎</span><strong>${esc(date)}</strong></div><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("");
  const feedbackHtml = aboutFeedbackPhotos.map(([src, alt], index) => `<a class="${index === 0 ? "featured" : ""}" href="#feedback-gallery-${index + 1}" aria-label="Open ${attr(alt)}"><figure><img src="${relAsset(src, 0)}" alt="${attr(alt)}" loading="lazy"><figcaption>${esc(alt)}</figcaption></figure></a>`).join("");
  const feedbackLightboxHtml = aboutFeedbackPhotos.map(([src, alt], index) => `<div class="about-lightbox" id="feedback-gallery-${index + 1}"><a class="about-lightbox-close" href="#customer-feedback">Close</a><img src="${relAsset(src, 0)}" alt="${attr(alt)}"><p>${esc(alt)}</p></div>`).join("");
  const certificateHtml = aboutCertificates.map(([src, alt], index) => `<a class="${index === 0 ? "featured" : ""}" href="#certificate-gallery-${index + 1}" aria-label="Open ${attr(alt)}"><figure><img src="${relAsset(src, 0)}" alt="${attr(alt)}" loading="lazy"><figcaption><span>✓</span>${esc(alt)}</figcaption></figure></a>`).join("");
  const certificateLightboxHtml = aboutCertificates.map(([src, alt], index) => `<div class="about-lightbox about-cert-lightbox" id="certificate-gallery-${index + 1}"><a class="about-lightbox-close" href="#certification-gallery">Close</a><img src="${relAsset(src, 0)}" alt="${attr(alt)}"><p>${esc(alt)}</p></div>`).join("");
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Guangzhou Toksurvey Information Technology Co., Ltd.",
    alternateName: "TOKNAV",
    url: "https://toknavgnss.md/about",
    logo: "https://toknavgnss.md/public/assets/toknav-logo-blue.png",
    sameAs: socialLinks.map((item) => item.url)
  };

  return shell({
    title: "About TOKNAV | GNSS Receiver Manufacturer, Certifications and Global Customers",
    description: "Learn about TOKNAV's GNSS product history, latest company video, overseas customer feedback and certification portfolio including CE, FCC, IGS, NGS, KC and ISO9001.",
    schema: `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>`,
    body: `<section class="about-hero">
      <div class="about-hero-copy">
        <span class="contact-label">About TOKNAV</span>
        <h1>High-Precision GNSS Innovation Built for Global B2B Projects</h1>
        <p>TOKNAV develops GNSS receivers, CORS/VRS systems, rugged controllers, precision agriculture products and application solutions for surveying, construction, machine control and monitoring customers worldwide.</p>
        <div class="about-hero-actions"><a class="primary-button" href="inquiry.html">Send Requirements →</a><a class="secondary-button" href="https://www.youtube.com/@Toknav2024" target="_blank" rel="noopener noreferrer">Visit YouTube Channel</a></div>
        <div class="about-proof-row"><span>◎ Global projects</span><span>◎ Distributor support</span><span>◎ Certified products</span></div>
      </div>
      <div class="about-video-card">
        <iframe src="${attr(youtubeUploadsEmbed)}" title="Latest TOKNAV YouTube uploads" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" loading="lazy" allowfullscreen></iframe>
        <div><strong>Latest TOKNAV YouTube uploads</strong><span>Auto-updates from the official channel playlist</span></div>
      </div>
    </section>
    <section class="about-section">
      <div class="about-section-heading"><span>Product Roadmap</span><h2>Product Launch Timeline</h2><p>Structured to match TOKNAV's official History section, with concise B2B product context.</p></div>
      <div class="about-timeline">${timelineHtml}</div>
    </section>
    <section class="about-section about-blue-band" id="customer-feedback">
      <div class="about-section-heading light"><span>Customer Feedback</span><h2>Field Photos from Global Customers and Exhibitions</h2><p>Selected photos emphasize real customer visits, booth discussions, overseas storefronts and product demonstrations.</p></div>
      <div class="about-gallery-grid about-feedback-gallery">${feedbackHtml}</div>
      <div class="about-lightbox-set" aria-hidden="true">${feedbackLightboxHtml}</div>
    </section>
    <section class="about-section" id="certification-gallery">
      <div class="about-section-heading"><span>Quality and Compliance</span><h2>Certification Gallery</h2><p>Selected certificate covers from TOKNAV shared certification folders, including product and company-level compliance materials.</p></div>
      <div class="about-gallery-grid about-cert-gallery">${certificateHtml}</div>
      <div class="about-lightbox-set" aria-hidden="true">${certificateLightboxHtml}</div>
    </section>
    <section class="about-final-cta">
      <div><span>Work with TOKNAV</span><h2>Need product documents, certificates or distributor support?</h2><p>Send your market, target product line and project requirements. TOKNAV can prepare a practical quotation and document package.</p></div>
      <a class="primary-button" href="inquiry.html">Get a Quote →</a>
    </section>`
  });
}

function categoryPage(category) {
  const categoryProducts = getProductsByCategory(category.slug);
  const applications = getCategoryApplications(category.slug);
  const cards = categoryProducts.map((product) => `<a class="product-list-card" href="${"../".repeat(2)}products/${category.slug}/${product.slug}.html">
    <div class="product-list-image"><img src="${relAsset(product.image, 2)}" alt="${attr(product.name)}"></div>
    <div class="product-list-copy"><span>${esc(product.type)}</span><h3>${esc(product.name)}</h3><p>${esc(product.excerpt)}</p><div class="product-mini-specs">${product.highlights.slice(0, 3).map((item) => `<em>${esc(item)}</em>`).join("")}</div><strong>View model details →</strong></div>
  </a>`).join("");
  const applicationHtml = applications.map((item) => `<article><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p><span>${esc(item.products)}</span></article>`).join("");

  return shell({
    title: `${category.name} | TOKNAV Product Category`,
    description: category.description,
    depth: 2,
    body: `<section class="product-category-hero">
      <div><a class="back-link" href="../../products.html">← All Products</a><span class="contact-label">${esc(category.kicker)}</span><h1>${esc(category.title)}</h1><p>${esc(category.description)}</p><div class="product-meta-row"><span>${categoryProducts.length} products</span><span>Source: ${esc(category.sourcePdf)}</span></div></div>
      <div class="category-visual-card"><img src="${relAsset(category.image, 2)}" alt="${attr(category.name)}"></div>
    </section>
    ${applicationHtml ? `<section class="category-application-section"><div class="product-index-top"><div><h2>Application Scenarios</h2><p>Typical buying contexts for this product category, organized for overseas distributors, contractors and system integrators.</p></div></div><div class="category-application-grid">${applicationHtml}</div></section>` : ""}
    <section class="product-section"><div class="product-index-top"><div><h2>${esc(category.name)} Lineup</h2><p>${esc(category.buyerIntent)}</p></div><a class="secondary-button" href="../../inquiry.html">Send Requirements →</a></div><div class="product-list-grid">${cards}</div></section>
    <section class="product-cta-band"><span>⌕</span><div><strong>Not sure which model fits your project?</strong><span>Send your country, application, quantity and preferred correction method. TOKNAV can recommend a suitable product package.</span></div><a href="../../inquiry.html">Get Recommendation →</a></section>`
  });
}

function detailPage(category, product) {
  const related = getProductsByCategory(category.slug).filter((item) => item.slug !== product.slug).slice(0, 4);
  const specGroups = getProductSpecGroups(product);
  const downloads = getProductDownloads(product);
  const quickSpecs = getProductQuickSpecs(product);
  const datasheet = getProductDatasheet(product);
  const gallery = getProductGallery(product);
  const buyerBenefits = getProductBuyerBenefits(product);
  const faqs = getProductFaqs(product);
  const inquiryHref = relDownload(downloads.find((item) => item.kind === "quote")?.href ?? "/inquiry", 2);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: "TOKNAV" },
    category: category.name,
    image: product.image,
    description: product.excerpt,
    manufacturer: { "@type": "Organization", name: "Guangzhou Toksurvey Information Technology Co., Ltd." },
    additionalProperty: specGroups.flatMap((group) => group.specs.map((spec) => ({ "@type": "PropertyValue", name: spec.label, value: spec.value })))
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } }))
  };

  const specHtml = specGroups.map((group) => `<div class="spec-group"><h3>${esc(group.title)}</h3><div class="spec-table">${group.specs.map((spec) => `<div><strong>${esc(spec.label)}</strong><span>${esc(spec.value)}</span></div>`).join("")}</div></div>`).join("");
  const downloadHtml = downloads.map((item) => {
    const href = relDownload(item.href, 2);
    const downloadAttr = item.kind !== "quote" && href.endsWith(".pdf") ? " download" : "";
    return `<a class="download-card ${item.kind}" href="${attr(href)}"${downloadAttr}><span>${item.kind === "quote" ? "↗" : "↓"}</span><strong>${esc(item.label)}</strong></a>`;
  }).join("");
  const faqHtml = faqs.map((faq) => `<article><span>?</span><div><h3>${esc(faq.question)}</h3><p>${esc(faq.answer)}</p></div></article>`).join("");
  const relatedHtml = related.map((item) => `<a href="${item.slug}.html"><img src="${relAsset(item.image, 2)}" alt="${attr(item.name)}"><strong>${esc(item.name)}</strong><span>${esc(item.type)}</span></a>`).join("");
  const relatedBlock = related.length ? `\n        <section><h2>Related Models</h2><div class="related-products">${relatedHtml}</div></section>` : "";
  const quickSpecHtml = quickSpecs.map((spec) => `<div><strong>${esc(spec.label)}</strong><span>${esc(spec.value)}</span></div>`).join("");
  const benefitHtml = buyerBenefits.map((benefit) => `<article><span>✓</span><p>${esc(benefit)}</p></article>`).join("");
  const appHtml = product.applications.map((app) => `<article><strong>${esc(app)}</strong><p>Recommended configuration and accessories can be confirmed according to the project site, correction method and buyer's country.</p></article>`).join("");
  const robotStory = product.slug === "marking-robot" ? `<section class="robot-story-section"><div class="robot-story-copy"><h2>From design file to field marking</h2><p>The TR10Pro workflow is built around practical marking work: import a design file, calculate the task, plan the route, locate with RTK and let the robot mark repeatable lines on the field.</p><div class="robot-steps"><span>Import DXF / CSV</span><span>Plan route</span><span>RTK locate</span><span>Automatic marking</span></div></div><div class="robot-gallery">${gallery.slice(1).map((src) => `<figure><img src="${relAsset(src, 2)}" alt="${attr(product.name)} product view"></figure>`).join("")}</div></section>` : "";

  return shell({
    title: getProductSeoTitle(product),
    description: getProductMetaDescription(product),
    depth: 2,
    schema: `<script type="application/ld+json">${JSON.stringify(productSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`,
    body: `<section class="product-detail-hero ${product.slug === "marking-robot" ? "robot-detail-hero" : ""}">
      <div class="product-detail-copy"><a class="back-link" href="index.html">← Back to ${esc(category.name)}</a><span class="contact-label">${esc(product.type)}</span><h1>${esc(product.name)}</h1><p>${esc(product.excerpt)}</p><div class="product-detail-actions"><a class="primary-button" href="${attr(inquiryHref)}">Get a Quote →</a><a class="secondary-button" href="#downloads">Download Catalog</a></div></div>
      <div class="product-detail-image"><span class="product-image-brand"><img src="${"../".repeat(2)}public/assets/toknav-logo-blue.png" alt="TOKNAV"></span><img src="${relAsset(product.image, 2)}" alt="${attr(product.name)}"></div>
    </section>
    <nav class="product-anchor-nav" aria-label="Product sections"><a href="#overview">Overview</a><a href="#applications">Applications</a><a href="#specifications">Specifications</a><a href="#downloads">Downloads</a><a href="#inquiry">Inquiry</a></nav>
    <section class="product-quick-spec-strip">${quickSpecHtml}</section>
${robotStory}
    <section class="product-detail-layout">
      <div class="product-detail-main">
        <section id="overview"><h2>Key Features</h2><div class="feature-grid">${product.highlights.map((feature) => `<div><span>✓</span><span>${esc(feature)}</span></div>`).join("")}</div></section>
        <section><div class="product-section-heading"><span>Buyer-focused value</span><h2>Why overseas buyers choose this model</h2><p>Structured for dealers, contractors and system integrators comparing receiver performance, kit completeness and after-sales preparation.</p></div><div class="product-benefit-grid">${benefitHtml}</div></section>
        <section id="applications"><div class="product-section-heading"><span>Applications</span><h2>Typical project scenarios</h2><p>Use the application cards as a quotation starting point. TOKNAV can confirm the final kit after checking project environment and delivery requirements.</p></div><div class="product-application-grid">${appHtml}</div></section>
        <section id="specifications"><div class="product-section-heading"><span>Brochure-based details</span><h2>Complete Specifications</h2><p>The table below organizes key parameters from TOKNAV catalogs and model datasheets into procurement-friendly groups for easier comparison.</p></div><div class="spec-group-stack">${specHtml}</div></section>
        <section class="product-download-section" id="downloads"><div class="product-section-heading"><span>Downloads and inquiry package</span><h2>Get Catalog, Datasheet and Quote Support</h2><p>Download the category brochure or send the model requirement directly to TOKNAV sales for the latest datasheet, price and recommended accessories.</p></div><div class="download-grid">${downloadHtml}</div><div class="quote-cta-panel"><div><span>Ready for quotation?</span><strong>Send your target quantity and application for ${esc(product.name)}.</strong></div><a class="primary-button" href="${attr(inquiryHref)}">Send Requirements →</a></div></section>
        <section><h2>Buyer Notes</h2><p>Parameters may be updated by the manufacturer. For quotation, distributor cooperation or OEM/ODM projects, please send your target application, quantity, country and required accessories so TOKNAV can confirm the latest configuration.</p></section>
        <section><div class="product-section-heading"><span>Procurement FAQ</span><h2>Common Questions Before Purchase</h2></div><div class="product-faq-list">${faqHtml}</div></section>
        <section class="product-final-cta" id="inquiry"><div><span>Procurement support</span><h2>Need help choosing a complete receiver kit?</h2><p>Send your model, target quantity, market country, application and accessory preference. TOKNAV can prepare a practical quote package for distributor review or project bidding.</p></div><a class="primary-button" href="${attr(inquiryHref)}">Get Model Quote →</a></section>
${relatedBlock}
      </div>
    </section>`
  });
}

fs.rmSync(path.join(root, "products"), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "products"), { recursive: true });
fs.writeFileSync(path.join(root, "index.html"), homeIndex());
fs.writeFileSync(path.join(root, "products.html"), productsIndex());
fs.writeFileSync(path.join(root, "about.html"), aboutPage());

for (const category of productCategories) {
  const categoryDir = path.join(root, "products", category.slug);
  fs.mkdirSync(categoryDir, { recursive: true });
  fs.writeFileSync(path.join(categoryDir, "index.html"), categoryPage(category));
  for (const product of getProductsByCategory(category.slug)) {
    fs.writeFileSync(path.join(categoryDir, `${product.slug}.html`), detailPage(category, product));
  }
}

console.log(`Generated ${productCategories.length} category pages and ${products.length} product detail pages.`);
