import { jsonError, jsonOk, normalizeProductInput, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../../lib/cms/storage";
import type { CmsProduct } from "../../../../lib/cms/types";

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
  const product = data.products.find((item) => item.id === id);
  if (!product) return jsonError("Product not found.", 404);
  return jsonOk(product);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<Partial<CmsProduct>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  const index = data.products.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Product not found.", 404);

  const product = normalizeProductInput(body, data.products[index]);
  const duplicate = data.products.some(
    (item) => item.id !== id && item.slug === product.slug && item.category === product.category
  );
  if (duplicate) return jsonError("Another product already uses this slug in this category.");

  data.products[index] = product;
  await writeCmsData(data, `Update CMS product ${product.name}`);
  return jsonOk(product);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const product = data.products.find((item) => item.id === id);
  if (!product) return jsonError("Product not found.", 404);

  data.products = data.products.filter((item) => item.id !== id);
  await writeCmsData(data, `Delete CMS product ${product.name}`);
  return jsonOk({ id });
}
