import { getCmsSettings } from "../lib/cms/public";
import { WHATSAPP_PHONE, whatsappHref } from "../lib/contactInfo";

export default function WhatsAppButton() {
  const settings = getCmsSettings();
  const href = whatsappHref(settings.whatsappPhone || WHATSAPP_PHONE);

  return (
    <a
      aria-label="Contact TOKNAV on WhatsApp"
      className="whatsapp-float"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title="Contact TOKNAV on WhatsApp"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M16.02 4.2c-6.45 0-11.7 5.14-11.7 11.46 0 2.18.64 4.29 1.84 6.11L4.2 27.8l6.28-1.91a11.98 11.98 0 0 0 5.54 1.37c6.45 0 11.7-5.14 11.7-11.46S22.47 4.2 16.02 4.2Zm0 20.99c-1.78 0-3.52-.49-5.04-1.42l-.36-.22-3.72 1.13 1.16-3.56-.24-.37a9.33 9.33 0 0 1-1.43-4.95c0-5.18 4.32-9.39 9.63-9.39s9.63 4.21 9.63 9.39-4.32 9.39-9.63 9.39Zm5.29-7.04c-.29-.14-1.71-.83-1.98-.92-.27-.1-.46-.14-.66.14-.19.28-.76.92-.93 1.11-.17.19-.34.21-.63.07-.29-.14-1.22-.44-2.32-1.41-.86-.75-1.44-1.68-1.61-1.96-.17-.28-.02-.43.13-.57.13-.13.29-.33.44-.49.15-.16.19-.28.29-.47.1-.19.05-.35-.02-.49-.07-.14-.66-1.55-.9-2.13-.24-.56-.48-.48-.66-.49h-.56c-.19 0-.51.07-.78.35-.27.28-1.02.98-1.02 2.39s1.05 2.77 1.2 2.96c.15.19 2.07 3.1 5.02 4.34.7.3 1.25.48 1.68.61.71.22 1.35.19 1.86.12.57-.08 1.71-.69 1.95-1.35.24-.66.24-1.23.17-1.35-.07-.12-.27-.19-.56-.33Z" />
      </svg>
    </a>
  );
}
