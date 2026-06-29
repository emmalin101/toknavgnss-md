import { jsonError, jsonOk, normalizeInquiryInput, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../../lib/cms/storage";
import type { CmsInquiry } from "../../../../lib/cms/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getId(context: RouteContext) {
  return (await context.params).id;
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const inquiry = data.inquiries.find((item) => item.id === id);
  if (!inquiry) return jsonError("Inquiry not found.", 404);
  return jsonOk(inquiry);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<Partial<CmsInquiry>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  const index = data.inquiries.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Inquiry not found.", 404);

  const inquiry = normalizeInquiryInput(body, data.inquiries[index]);
  data.inquiries[index] = inquiry;
  await writeCmsData(data, `Update CMS inquiry ${inquiry.name}`);
  return jsonOk(inquiry);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const inquiry = data.inquiries.find((item) => item.id === id);
  if (!inquiry) return jsonError("Inquiry not found.", 404);

  data.inquiries = data.inquiries.filter((item) => item.id !== id);
  await writeCmsData(data, `Delete CMS inquiry ${inquiry.name}`);
  return jsonOk({ id });
}
