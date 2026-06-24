import { jsonError, jsonOk, normalizePageInput, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../../lib/cms/storage";
import type { CmsPage } from "../../../../lib/cms/types";

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
  const page = data.pages.find((item) => item.id === id);
  if (!page) return jsonError("Page not found.", 404);
  return jsonOk(page);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<Partial<CmsPage>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  const index = data.pages.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Page not found.", 404);

  const page = normalizePageInput(body, data.pages[index]);
  const duplicate = data.pages.some((item) => item.id !== id && (item.path === page.path || item.slug === page.slug));
  if (duplicate) return jsonError("Another page already uses this slug or path.");

  data.pages[index] = page;
  await writeCmsData(data, `Update CMS page ${page.title}`);
  return jsonOk(page);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const page = data.pages.find((item) => item.id === id);
  if (!page) return jsonError("Page not found.", 404);

  data.pages = data.pages.filter((item) => item.id !== id);
  await writeCmsData(data, `Delete CMS page ${page.title}`);
  return jsonOk({ id });
}
