import { cleanString, jsonError, jsonOk, parseJsonBody, requireAdminApi } from "../../../lib/cms/api";
import { nowIso } from "../../../lib/cms/defaults";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsSettings } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.settings);
}

export async function PUT(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsSettings>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  data.settings = {
    ...data.settings,
    siteName: cleanString(body.siteName, 120) || data.settings.siteName,
    logo: cleanString(body.logo, 500),
    favicon: cleanString(body.favicon, 500),
    defaultSeoTitle: cleanString(body.defaultSeoTitle, 220),
    defaultSeoDescription: cleanString(body.defaultSeoDescription, 360),
    socialLinks: {
      ...data.settings.socialLinks,
      facebook: cleanString(body.socialLinks?.facebook, 500),
      instagram: cleanString(body.socialLinks?.instagram, 500),
      linkedin: cleanString(body.socialLinks?.linkedin, 500),
      youtube: cleanString(body.socialLinks?.youtube, 500)
    },
    contactEmail: cleanString(body.contactEmail, 160),
    contactEmailSecondary: cleanString(body.contactEmailSecondary, 160),
    contactPhone: cleanString(body.contactPhone, 80),
    whatsappPhone: cleanString(body.whatsappPhone, 80),
    footerText: cleanString(body.footerText, 500),
    updatedAt: nowIso()
  };

  await writeCmsData(data, "Update CMS settings");
  return jsonOk(data.settings);
}
