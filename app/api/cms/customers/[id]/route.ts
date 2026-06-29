import { jsonError, jsonOk, normalizeCustomerInput, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../../lib/cms/storage";
import type { CmsCustomer } from "../../../../lib/cms/types";

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
  const customer = data.customers.find((item) => item.id === id);
  if (!customer) return jsonError("Customer not found.", 404);
  return jsonOk(customer);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<Partial<CmsCustomer>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  const index = data.customers.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Customer not found.", 404);

  const customer = normalizeCustomerInput(body, data.customers[index]);
  data.customers[index] = customer;
  await writeCmsData(data, `Update CMS customer ${customer.name}`);
  return jsonOk(customer);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const customer = data.customers.find((item) => item.id === id);
  if (!customer) return jsonError("Customer not found.", 404);

  data.customers = data.customers.filter((item) => item.id !== id);
  data.inquiries = data.inquiries.map((inquiry) =>
    inquiry.customerId === id ? { ...inquiry, customerId: "", updatedAt: new Date().toISOString() } : inquiry
  );
  await writeCmsData(data, `Delete CMS customer ${customer.name}`);
  return jsonOk({ id });
}
