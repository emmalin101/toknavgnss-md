import { Clock, Mail, MapPinned, MessageCircle, ShieldCheck } from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import InquiryForm from "../components/InquiryForm";
import SiteHeader from "../components/SiteHeader";
import { getBlockData, getPublishedCmsPageByPath } from "../lib/cms/public";
import { CONTACT_EMAILS, MOLDOVA_DEALER, WHATSAPP_PHONE } from "../lib/contactInfo";

const fallbackHero = {
  label: "B2B Inquiry",
  title: "Request a GNSS Receiver Quote",
  subtitle:
    "Send your project details to TOKNAV. Our team will help match the right GNSS receiver, antenna, CORS/VRS solution or distributor-ready package for your market."
};

export default function InquiryPage() {
  const cmsPage = getPublishedCmsPageByPath("/inquiry");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");

  return (
    <main>
      <SiteHeader />

      <section className="inquiry-page-shell">
        <div className="inquiry-intro-panel">
          <span className="contact-label">{String(hero.label)}</span>
          <h1 data-i18n="inquiry.title">{String(hero.title)}</h1>
          <p data-i18n="inquiry.text">{String(hero.subtitle)}</p>
          <div className="inquiry-contact-list">
            <div>
              <Mail size={20} />
              <span>{CONTACT_EMAILS.join(" / ")}</span>
            </div>
            <div>
              <MessageCircle size={20} />
              <span>WhatsApp: {WHATSAPP_PHONE}</span>
            </div>
            <div>
              <MapPinned size={20} />
              <span>{MOLDOVA_DEALER.officeAddress}</span>
            </div>
            <div>
              <Clock size={20} />
              <span>Business-day reply within 24 hours</span>
            </div>
          </div>
          <div className="inquiry-trust-box">
            <ShieldCheck size={22} />
              <span data-i18n="inquiry.privacy">
              Required fields are clearly marked. Your information is used only
              for quotation and project communication.
            </span>
          </div>
        </div>

        <div className="inquiry-form-panel">
          <InquiryForm />
        </div>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />
    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/inquiry");
  return {
    title: cmsPage?.seoTitle || "Request a GNSS Receiver Quote | TOKNAV",
    description:
      cmsPage?.seoDescription ||
      "Send your project details to TOKNAV for GNSS receiver, antenna, CORS/VRS, machine control or distributor quotation support.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}
