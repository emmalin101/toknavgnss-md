import { jsonError, jsonOk, normalizeProductInput, parseJsonBody, requireAdminApi, validateRequired } from "../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsProduct } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.products);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsProduct>>(request);
  if (!body) return jsonError("Invalid request body.");

  const product = normalizeProductInput(body);
  const errors = validateRequired({ name: product.name, slug: product.slug, category: product.category });
  if (Object.keys(errors).length) return jsonError("Please complete required fields.", 400, errors);

  const data = await readCmsData();
  if (data.products.some((item) => item.slug === product.slug && item.category === product.category)) {
    return jsonError("A product with this slug already exists in this category.");
  }

  data.products.unshift(product);
  await writeCmsData(data, `Create CMS product ${product.name}`);
  return jsonOk(product, 201);
}
