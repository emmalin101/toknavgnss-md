export const CONTACT_EMAILS = ["info@toknavgnss.md", "sales@toknavgnss.md"] as const;
export const PRIMARY_CONTACT_EMAIL = CONTACT_EMAILS[0];
export const SALES_CONTACT_EMAIL = CONTACT_EMAILS[1];
export const CONTACT_PHONE = "+373 62022040";
export const WHATSAPP_PHONE = "+373 62022040";
export const WHATSAPP_NUMBER = "37362022040";
export const WHATSAPP_MESSAGE =
  "Hello%2C%20I%20am%20interested%20in%20your%20products.%20Please%20send%20me%20more%20details.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export const MOLDOVA_DEALER = {
  companyName: "EDTS S.R.L.",
  legalAddress: "MD-6526, rl. Anenii Noi, s. Mereni, str. Cutezanței, 1",
  officeAddress: "MD-2032, or. Chisinau, sect. Botanica, str. Burebista 17a, off. 108",
  lat: 46.9845432,
  lon: 28.8812061,
  mapLabel: "EDTS S.R.L. Moldova Office"
} as const;

export const TOKNAV_CHINA_OFFICE = {
  companyName: "Guangzhou Toksurvey Information Technology Co., Ltd.",
  address: "Room 801-6, Building B, No. 9 Caipin Road, Huangpu District, Guangzhou, China 510000",
  lat: 23.1646848,
  lon: 113.4295982,
  mapLabel: "TOKNAV Guangzhou Office"
} as const;

export function mailtoHref(emails: readonly string[] = CONTACT_EMAILS) {
  return `mailto:${emails.join(",")}`;
}

export function whatsappHref(phone = WHATSAPP_PHONE) {
  const digits = phone.replace(/\D/g, "") || WHATSAPP_NUMBER;
  return `https://wa.me/${digits}?text=${WHATSAPP_MESSAGE}`;
}

export function osmEmbedUrl(lat: number, lon: number, delta = 0.006) {
  const left = lon - delta;
  const right = lon + delta;
  const bottom = lat - delta;
  const top = lat + delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
}

export function osmSearchUrl(query: string) {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}
