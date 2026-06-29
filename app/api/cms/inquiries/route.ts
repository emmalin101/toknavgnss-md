import {
  jsonError,
  jsonOk,
  normalizeInquiryInput,
  parseJsonBody,
  requireAdminApi,
  validateRequired
} from "../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsInquiry } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.inquiries);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsInquiry>>(request);
  if (!body) return jsonError("Invalid request body.");

  const inquiry = normalizeInquiryInput({ ...body, source: body.source || "manual" });
  const errors = validateRequired({ name: inquiry.name, email: inquiry.email, whatsapp: inquiry.whatsapp });
  if (Object.keys(errors).length) return jsonError("Please complete required fields.", 400, errors);

  const data = await readCmsData();
  data.inquiries.unshift(inquiry);
  await writeCmsData(data, `Create CMS inquiry ${inquiry.name}`);
  return jsonOk(inquiry, 201);
}
