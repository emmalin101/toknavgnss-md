import { jsonError, jsonOk, normalizePageInput, parseJsonBody, requireAdminApi, validateRequired } from "../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsPage } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.pages);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsPage>>(request);
  if (!body) return jsonError("Invalid request body.");

  const page = normalizePageInput(body);
  const errors = validateRequired({ title: page.title, path: page.path });
  if (Object.keys(errors).length) return jsonError("Please complete required fields.", 400, errors);

  const data = await readCmsData();
  if (data.pages.some((item) => item.path === page.path || item.slug === page.slug)) {
    return jsonError("A page with the same slug or path already exists.");
  }
  data.pages.unshift(page);
  await writeCmsData(data, `Create CMS page ${page.title}`);
  return jsonOk(page, 201);
}
