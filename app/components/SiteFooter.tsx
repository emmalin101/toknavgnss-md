import { Mail } from "lucide-react";
import SocialLinks from "./SocialLinks";
import { getCmsSettings } from "../lib/cms/public";
import {
  CONTACT_EMAILS,
  CONTACT_PHONE,
  MOLDOVA_DEALER,
  WHATSAPP_PHONE,
  mailtoHref,
  whatsappHref
} from "../lib/contactInfo";

const footerColumns = [
  {
    title: "Products",
    links: [
      ["GNSS Receiver", "/products/gnss-receivers"],
      ["Rugged & GIS", "/products/rugged-gis"],
      ["GNSS Antenna", "/products/gnss-antennas"],
      ["Precision Agriculture", "/products/precision-agriculture-machine-control"],
      ["Machine Control", "/products/precision-agriculture-machine-control"],
      ["VRS Solution", "/products/gnss-application-solutions"]
    ]
  },
  {
    title: "Solutions",
    links: [
      ["Land Surveying & Mapping", "/products/gnss-receivers"],
      ["Construction & Engineering", "/products/gnss-receivers"],
      ["Precision Agriculture", "/products/precision-agriculture-machine-control"],
      ["Monitoring & Deformation", "/products/gnss-application-solutions"],
      ["GIS Data Collection", "/products/rugged-gis"]
    ]
  },
  {
    title: "Support",
    links: [
      ["Download", "/products"],
      ["Knowledge Base", "/blog"],
      ["Video Tutorials", "https://www.youtube.com/@Toknav2024"],
      ["Warranty Policy", "/contact"],
      ["Contact Support", "/contact"]
    ]
  },
  {
    title: "About Us",
    links: [
      ["Company Profile", "/about"],
      ["News", "/news"],
      ["Careers", "/about"],
      ["Contact Us", "/contact"]
    ]
  }
];

export default function SiteFooter() {
  const settings = getCmsSettings();
  const emails = [...CONTACT_EMAILS];
  const phone = CONTACT_PHONE;
  const whatsapp = WHATSAPP_PHONE;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <a href="/" aria-label="TOKNAV home">
            <img src="/assets/toknav-logo-white.png" alt="TOKNAV" />
          </a>
          <p>{settings.footerText || "High-precision positioning solutions for a smarter world."}</p>
          <div className="site-footer-icons">
            <SocialLinks />
            <a className="social-link social-link-email" href={mailtoHref(emails)} aria-label="Email TOKNAV" title="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="site-footer-columns">
          {footerColumns.map((column) => (
            <nav aria-label={column.title} className="site-footer-column" key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map(([label, href]) => (
                <a
                  href={href}
                  key={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {label}
                </a>
              ))}
            </nav>
          ))}

          <div className="site-footer-column site-footer-contact">
            <strong>Contact Us</strong>
            <span>Email: <a href={mailtoHref(emails)}>{emails.join(" / ")}</a></span>
            <span>Phone: <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></span>
            <span>WhatsApp: <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer">{whatsapp}</a></span>
            <span>Company Name: {MOLDOVA_DEALER.companyName}</span>
            <span>Legal address: {MOLDOVA_DEALER.legalAddress}</span>
            <span>Office address: {MOLDOVA_DEALER.officeAddress}</span>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 {MOLDOVA_DEALER.companyName} All rights reserved.</span>
        <div>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
