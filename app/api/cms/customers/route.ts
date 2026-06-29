import {
  jsonError,
  jsonOk,
  normalizeCustomerInput,
  parseJsonBody,
  requireAdminApi,
  validateRequired
} from "../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsCustomer } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.customers);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsCustomer>>(request);
  if (!body) return jsonError("Invalid request body.");

  const customer = normalizeCustomerInput({ ...body, source: body.source || "manual" });
  const errors = validateRequired({ name: customer.name });
  if (Object.keys(errors).length) return jsonError("Please complete required fields.", 400, errors);

  const data = await readCmsData();
  data.customers.unshift(customer);
  await writeCmsData(data, `Create CMS customer ${customer.name}`);
  return jsonOk(customer, 201);
}
