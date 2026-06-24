import { ArrowRight, BadgeCheck, CalendarDays, Globe2, ShieldCheck, UsersRound } from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import SiteHeader from "../components/SiteHeader";
import { getBlockData, getPublishedCmsPageByPath } from "../lib/cms/public";
import type { CmsPage } from "../lib/cms/types";

const youtubeUploadsEmbed = "https://www.youtube.com/embed/videoseries?list=UU7YvmJlQYioSnNjsoxlBPxQ";
type GalleryTuple = [string, string];

const timeline = [
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

const defaultFeedbackPhotos: GalleryTuple[] = [
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

const defaultCertificates: GalleryTuple[] = [
  ["/assets/about/cert-ce-p8.webp", "CE certificate for P8 series"],
  ["/assets/about/cert-ce-t10pro.webp", "CE certificate for T10Pro"],
  ["/assets/about/cert-fcc-t30.webp", "FCC grant for T30 series"],
  ["/assets/about/cert-igs-t10pro.webp", "IGS certification for T10Pro"],
  ["/assets/about/cert-ngs.webp", "NGS calibration certificate"],
  ["/assets/about/cert-kc.webp", "KC certification"],
  ["/assets/about/cert-iso9001.webp", "ISO9001 company certificate"]
];

const fallbackHero = {
  label: "About TOKNAV",
  title: "High-Precision GNSS Innovation Built for Global B2B Projects",
  subtitle:
    "TOKNAV develops GNSS receivers, CORS/VRS systems, rugged controllers, precision agriculture products and application solutions for surveying, construction, machine control and monitoring customers worldwide."
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function galleryTupleFromItem(item: unknown): GalleryTuple | null {
  if (Array.isArray(item)) {
    const image = textValue(item[0]);
    const alt = textValue(item[1]) || "TOKNAV gallery image";
    return image ? [image, alt] : null;
  }

  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const image = textValue(record.image);
  const alt =
    textValue(record.alt) ||
    textValue(record.caption) ||
    textValue(record.title) ||
    "TOKNAV gallery image";

  return image ? [image, alt] : null;
}

function getGalleryItems(cmsPage: CmsPage | null | undefined, blockTitle: string, fallback: GalleryTuple[]) {
  const block = cmsPage?.blocks.find((item) => item.type === "custom" && item.title === blockTitle);
  const items = Array.isArray(block?.data.items)
    ? block.data.items.map(galleryTupleFromItem).filter((item): item is GalleryTuple => Boolean(item))
    : [];
  return items.length ? items : fallback;
}

export default function AboutPage() {
  const cmsPage = getPublishedCmsPageByPath("/about");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");
  const feedbackPhotos = getGalleryItems(cmsPage, "about-feedback-gallery", defaultFeedbackPhotos);
  const certificates = getGalleryItems(cmsPage, "about-certification-gallery", defaultCertificates);

  return (
    <main>
      <SiteHeader />

      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="contact-label">{String(hero.label)}</span>
          <h1>{String(hero.title)}</h1>
          <p>{String(hero.subtitle)}</p>
          <div className="about-hero-actions">
            <a className="primary-button" href="/inquiry">
              Send Requirements <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="https://www.youtube.com/@Toknav2024" target="_blank" rel="noopener noreferrer">
              Visit YouTube Channel
            </a>
          </div>
          <div className="about-proof-row">
            <span><Globe2 size={18} /> Global projects</span>
            <span><UsersRound size={18} /> Distributor support</span>
            <span><ShieldCheck size={18} /> Certified products</span>
          </div>
        </div>
        <div className="about-video-card">
          <iframe
            src={youtubeUploadsEmbed}
            title="Latest TOKNAV YouTube uploads"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="lazy"
            allowFullScreen
          />
          <div>
            <strong>Latest TOKNAV YouTube uploads</strong>
            <span>Auto-updates from the official channel playlist</span>
          </div>
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />

      <section className="about-section">
        <div className="about-section-heading">
          <span>Product Roadmap</span>
          <h2>Product Launch Timeline</h2>
          <p>Structured to match TOKNAV's official History section, with concise B2B product context.</p>
        </div>
        <div className="about-timeline">
          {timeline.map(([date, title, text]) => (
            <article key={`${date}-${title}`}>
              <div><CalendarDays size={18} /><strong>{date}</strong></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-blue-band" id="customer-feedback">
        <div className="about-section-heading light">
          <span>Customer Feedback</span>
          <h2>Field Photos from Global Customers and Exhibitions</h2>
          <p>Selected photos emphasize real customer visits, booth discussions, overseas storefronts and product demonstrations.</p>
        </div>
        <div className="about-gallery-grid about-feedback-gallery">
          {feedbackPhotos.map(([src, alt], index) => (
            <a className={index === 0 ? "featured" : ""} href={`#feedback-gallery-${index + 1}`} key={src} aria-label={`Open ${alt}`}>
              <figure>
                <img src={src} alt={alt} loading="lazy" />
                <figcaption>{alt}</figcaption>
              </figure>
            </a>
          ))}
        </div>
        <div className="about-lightbox-set" aria-hidden="true">
          {feedbackPhotos.map(([src, alt], index) => (
            <div className="about-lightbox" id={`feedback-gallery-${index + 1}`} key={`${src}-lightbox`}>
              <a className="about-lightbox-close" href="#customer-feedback">Close</a>
              <img src={src} alt={alt} />
              <p>{alt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section" id="certification-gallery">
        <div className="about-section-heading">
          <span>Quality and Compliance</span>
          <h2>Certification Gallery</h2>
          <p>Selected certificate covers from TOKNAV shared certification folders, including product and company-level compliance materials.</p>
        </div>
        <div className="about-gallery-grid about-cert-gallery">
          {certificates.map(([src, alt], index) => (
            <a className={index === 0 ? "featured" : ""} href={`#certificate-gallery-${index + 1}`} key={src} aria-label={`Open ${alt}`}>
              <figure>
                <img src={src} alt={alt} loading="lazy" />
                <figcaption><BadgeCheck size={16} /> {alt}</figcaption>
              </figure>
            </a>
          ))}
        </div>
        <div className="about-lightbox-set" aria-hidden="true">
          {certificates.map(([src, alt], index) => (
            <div className="about-lightbox about-cert-lightbox" id={`certificate-gallery-${index + 1}`} key={`${src}-lightbox`}>
              <a className="about-lightbox-close" href="#certification-gallery">Close</a>
              <img src={src} alt={alt} />
              <p>{alt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-final-cta">
        <div>
          <span>Work with TOKNAV</span>
          <h2>Need product documents, certificates or distributor support?</h2>
          <p>Send your market, target product line and project requirements. TOKNAV can prepare a practical quotation and document package.</p>
        </div>
        <a className="primary-button" href="/inquiry">Get a Quote <ArrowRight size={18} /></a>
      </section>
    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/about");
  return {
    title: cmsPage?.seoTitle || "About TOKNAV | GNSS Receiver Manufacturer, Certifications and Global Customers",
    description:
      cmsPage?.seoDescription ||
      "Learn about TOKNAV's GNSS product history, latest company video, overseas customer feedback and certification portfolio including CE, FCC, IGS, NGS, KC and ISO9001.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
