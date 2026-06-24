import {
  ArrowRight,
  Building2,
  Clock,
  Handshake,
  ListChecks,
  Globe2,
  Mail,
  MapPinned,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Store
} from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import SiteHeader from "../components/SiteHeader";
import { getBlockData, getCmsSettings, getPublishedCmsPageByPath } from "../lib/cms/public";
import {
  CONTACT_PHONE,
  MOLDOVA_DEALER,
  PRIMARY_CONTACT_EMAIL,
  SALES_CONTACT_EMAIL,
  TOKNAV_CHINA_OFFICE,
  WHATSAPP_PHONE,
  mailtoHref,
  osmEmbedUrl,
  osmSearchUrl,
  whatsappHref
} from "../lib/contactInfo";

const moldovaMapSrc = osmEmbedUrl(MOLDOVA_DEALER.lat, MOLDOVA_DEALER.lon);
const chinaMapSrc = osmEmbedUrl(TOKNAV_CHINA_OFFICE.lat, TOKNAV_CHINA_OFFICE.lon);

const fallbackHero = {
  label: "Contact TOKNAV",
  title: "How Can We Help?",
  subtitle:
    "Reach TOKNAV for GNSS product quotation, distributor cooperation, dealer support and technical solution support."
};

const contactEntries = [
  {
    href: "#locations",
    title: "Locations",
    text: "Moldova dealer, TOKNAV China office and OpenStreetMap locations.",
    icon: MapPinned
  },
  {
    href: "#dealer-support",
    title: "Find a Dealer",
    text: "Contact TOKNAV for regional distributor and local support guidance.",
    icon: Search
  },
  {
    href: "#inquiry",
    title: "Product Inquiry",
    text: "Send GNSS receiver, antenna, CORS/VRS or machine-control requirements.",
    icon: ListChecks
  },
  {
    href: "#dealer-support",
    title: "Become a Dealer",
    text: "Apply for channel cooperation, dealer support and catalog materials.",
    icon: Store
  }
];

export default function ContactPage() {
  const cmsPage = getPublishedCmsPageByPath("/contact");
  const settings = getCmsSettings();
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");
  const primaryEmail = settings.contactEmail || PRIMARY_CONTACT_EMAIL;
  const secondaryEmail = settings.contactEmailSecondary || SALES_CONTACT_EMAIL;
  const contactEmails = [primaryEmail, secondaryEmail].filter(Boolean);
  const phone = settings.contactPhone || CONTACT_PHONE;
  const whatsapp = settings.whatsappPhone || WHATSAPP_PHONE;
  const emailHref = mailtoHref(contactEmails);
  const whatsappUrl = whatsappHref(whatsapp);
  const inquiryFormAction = `https://formsubmit.co/${primaryEmail}`;

  return (
    <main>
      <SiteHeader />

      <section className="contact-hero">
        <span className="contact-label">{String(hero.label)}</span>
        <h1>{String(hero.title)}</h1>
        <p>{String(hero.subtitle)}</p>
        <div className="contact-quick-grid" aria-label="TOKNAV contact options">
          {contactEntries.map((item) => {
            const Icon = item.icon;
            return (
              <a href={item.href} key={item.title}>
                <Icon size={46} strokeWidth={1.8} />
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </a>
            );
          })}
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />

      <section className="contact-section dealer-location-section" id="locations">
        <div className="contact-info-panel dealer-info-panel">
          <span className="contact-label">Authorized Dealer in Moldova</span>
          <div className="contact-company-heading">
            <h2>{MOLDOVA_DEALER.companyName}</h2>
            <span>TOKNAV Moldova dealer and local project support</span>
          </div>
          <div className="contact-info-list">
            <div>
              <Building2 size={22} />
              <span>Company Name: {MOLDOVA_DEALER.companyName}</span>
            </div>
            <div>
              <MapPinned size={22} />
              <span>Legal address: {MOLDOVA_DEALER.legalAddress}</span>
            </div>
            <div>
              <MapPinned size={22} />
              <span>Office address: {MOLDOVA_DEALER.officeAddress}</span>
            </div>
            <div>
              <Mail size={22} />
              <a href={emailHref}>{contactEmails.join(" / ")}</a>
            </div>
            <div>
              <PhoneCall size={22} />
              <a href={`tel:${phone.replace(/\s/g, "")}`}>Phone: {phone}</a>
            </div>
            <div>
              <MessageCircle size={22} />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp: {whatsapp}
              </a>
            </div>
          </div>
          <div className="contact-proof-row">
            <span>
              <Store size={18} /> Local dealer
            </span>
            <span>
              <ShieldCheck size={18} /> TOKNAV product support
            </span>
            <span>
              <Globe2 size={18} /> Moldova project contact
            </span>
          </div>
          <div className="contact-panel-actions">
            <a href="#inquiry">Product Inquiry <ArrowRight size={16} /></a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Dealer</a>
          </div>
        </div>

        <div className="osm-card" aria-label="EDTS S.R.L. Moldova location on OpenStreetMap">
          <iframe
            src={moldovaMapSrc}
            title="EDTS S.R.L. Moldova dealer location on OpenStreetMap"
            loading="lazy"
          />
          <div className="map-overlay">
            <strong>{MOLDOVA_DEALER.mapLabel}</strong>
            <span>{MOLDOVA_DEALER.officeAddress}</span>
            <a href={osmSearchUrl(MOLDOVA_DEALER.officeAddress)} target="_blank" rel="noopener noreferrer">Open in OpenStreetMap</a>
          </div>
        </div>
      </section>

      <section className="contact-section china-location-section" id="china-office">
        <div className="contact-info-panel">
          <span className="contact-label" data-i18n="contact.location.label">TOKNAV China Office</span>
          <div className="contact-company-heading">
            <h2 data-i18n="contact.location.title">{TOKNAV_CHINA_OFFICE.companyName}</h2>
            <span>TOKNAV GNSS manufacturer and product support office</span>
          </div>
          <div className="contact-info-list">
            <div>
              <MapPinned size={22} />
              <span data-i18n="home.location.address">{TOKNAV_CHINA_OFFICE.address}</span>
            </div>
            <div>
              <Mail size={22} />
              <a href={emailHref}>{contactEmails.join(" / ")}</a>
            </div>
            <div>
              <MessageCircle size={22} />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp: {whatsapp}
              </a>
            </div>
            <div>
              <Clock size={22} />
              <span data-i18n="contact.location.reply">We usually reply within 24 hours on business days.</span>
            </div>
          </div>
          <div className="contact-proof-row">
            <span>
              <Building2 size={18} /> Source manufacturer
            </span>
            <span>
              <ShieldCheck size={18} /> Dealer support
            </span>
            <span>
              <Globe2 size={18} /> Global project support
            </span>
          </div>
          <div className="contact-panel-actions">
            <a href="#inquiry">Product Inquiry <ArrowRight size={16} /></a>
            <a href={emailHref}>Email TOKNAV</a>
          </div>
        </div>

        <div className="osm-card" aria-label="TOKNAV China office location on OpenStreetMap">
          <iframe
            src={chinaMapSrc}
            title="TOKNAV China office location on OpenStreetMap"
            loading="lazy"
          />
          <div className="map-overlay">
            <strong>{TOKNAV_CHINA_OFFICE.mapLabel}</strong>
            <span>{TOKNAV_CHINA_OFFICE.address}</span>
            <a href={osmSearchUrl(TOKNAV_CHINA_OFFICE.address)} target="_blank" rel="noopener noreferrer">Open in OpenStreetMap</a>
          </div>
        </div>
      </section>

      <section className="dealer-support-section" id="dealer-support">
        <div>
          <span className="contact-label">Dealer Cooperation</span>
          <h2>Distributor and Dealer Support</h2>
          <p>
            TOKNAV supports overseas dealers, project contractors and system
            integrators with product catalogs, model selection, technical
            matching, sample orders and market cooperation.
          </p>
        </div>
        <div className="dealer-support-grid">
          <article>
            <Handshake size={30} />
            <strong>Become a Dealer</strong>
            <span>Tell us your country, customer type and target product line.</span>
          </article>
          <article>
            <Building2 size={30} />
            <strong>Dealer Cooperation</strong>
            <span>Discuss product kits, packaging, sales materials and market support.</span>
          </article>
          <article>
            <Globe2 size={30} />
            <strong>Regional Support</strong>
            <span>Request channel materials, catalogs and solution documents.</span>
          </article>
        </div>
      </section>

      <section className="inquiry contact-inquiry" id="inquiry">
        <div>
          <div className="section-title">
            <h2 data-i18n="contact.form.title">Tell Us About Your Project</h2>
            <p data-i18n="contact.form.text">
              Share your country, application, product category and estimated
              quantity. Our team can recommend the suitable GNSS receiver,
              antenna or solution package.
            </p>
          </div>
          <div className="location-card contact-page-address">
            <div className="contact-bilingual-card">
              <MapPinned size={22} />
              <div className="contact-bilingual-list">
                <article>
                  <strong>Moldova Dealer</strong>
                  <span>{MOLDOVA_DEALER.companyName}</span>
                </article>
                <article>
                  <strong>Moldova Legal Address</strong>
                  <span>{MOLDOVA_DEALER.legalAddress}</span>
                </article>
                <article>
                  <strong>Moldova Office Address</strong>
                  <span>{MOLDOVA_DEALER.officeAddress}</span>
                </article>
                <article>
                  <strong>TOKNAV China Office</strong>
                  <span>{TOKNAV_CHINA_OFFICE.companyName}</span>
                </article>
                <article>
                  <strong>China Office Address</strong>
                  <span>{TOKNAV_CHINA_OFFICE.address}</span>
                </article>
              </div>
            </div>
          </div>
        </div>
        <form action={inquiryFormAction} className="quote-form" method="POST">
          <input type="hidden" name="_subject" value="New TOKNAV Contact Page Inquiry" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_cc" value={secondaryEmail} />
          <input type="hidden" name="_next" value="https://toknavgnss.md/thanks.html" />
          <input type="text" name="_honey" className="honeypot" tabIndex={-1} autoComplete="off" />
          <label>
            <span data-i18n="form.name">Name</span>
            <input name="name" placeholder="Your name" data-i18n-placeholder="form.placeholder.name" required />
          </label>
          <label>
            <span data-i18n="form.email">Email</span>
            <input name="email" placeholder="name@company.com" data-i18n-placeholder="form.placeholder.email" type="email" required />
          </label>
          <label>
            <span data-i18n="form.whatsapp">WhatsApp</span>
            <input name="whatsapp" placeholder="+373 62022040" data-i18n-placeholder="form.placeholder.whatsapp" type="tel" required />
          </label>
          <label>
            <span data-i18n="form.country">Country</span>
            <input name="country" placeholder="Your country or region" data-i18n-placeholder="form.placeholder.country" />
          </label>
          <label>
            <span data-i18n="form.product">Product Requirement</span>
            <select name="product" defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              <option>GNSS Receiver</option>
              <option>GNSS Antenna</option>
              <option>CORS / VRS Solution</option>
              <option>Precision Agriculture</option>
              <option>Machine Control</option>
              <option>Dealer Cooperation</option>
            </select>
          </label>
          <label>
            <span data-i18n="form.message">Message</span>
            <textarea name="message" placeholder="Tell us your application, quantity and timeline." data-i18n-placeholder="form.placeholder.message" />
          </label>
          <button type="submit">
            <span data-i18n="form.submit">Submit Inquiry</span> <ArrowRight size={18} />
          </button>
        </form>
      </section>

    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/contact");
  return {
    title: cmsPage?.seoTitle || "Contact TOKNAV | GNSS Receiver Quote and Dealer Cooperation",
    description:
      cmsPage?.seoDescription ||
      "Contact TOKNAV for GNSS receiver quotation, distributor cooperation, dealer support and technical solution support.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
