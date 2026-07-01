import {
  jsonError,
  jsonOk,
  normalizeInquiryInput,
  parseJsonBody,
  requireAdminApi,
  validateRequired
} from "../../../lib/cms/api";
import { createId } from "../../../lib/cms/defaults";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsCustomer, CmsInquiry } from "../../../lib/cms/types";

function normalizeWhatsapp(value: string) {
  return value.replace(/\s+/g, "");
}

function findMatchingCustomer(customers: CmsCustomer[], inquiry: CmsInquiry) {
  const normalizedEmail = inquiry.email.toLowerCase();
  const normalizedWhatsapp = normalizeWhatsapp(inquiry.whatsapp);
  return customers.find((customer) =>
    Boolean(
      (inquiry.customerId && customer.id === inquiry.customerId) ||
        (normalizedEmail && customer.email.toLowerCase() === normalizedEmail) ||
        (normalizedWhatsapp && normalizeWhatsapp(customer.whatsapp) === normalizedWhatsapp)
    )
  );
}

function mergeProducts(existing: string[], product: string) {
  const next = [...existing];
  if (product && !next.includes(product)) next.unshift(product);
  return next.slice(0, 64);
}

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
  const customerMatch = findMatchingCustomer(data.customers, inquiry);
  const customerId = customerMatch?.id || inquiry.customerId || createId("customer");
  inquiry.customerId = customerId;

  if (customerMatch) {
    data.customers = data.customers.map((customer) =>
      customer.id === customerMatch.id
        ? {
            ...customer,
            name: inquiry.name || customer.name,
            email: inquiry.email || customer.email,
            whatsapp: inquiry.whatsapp || customer.whatsapp,
            company: inquiry.company || customer.company,
            country: inquiry.country || customer.country,
            products: mergeProducts(customer.products || [], inquiry.product),
            source: customer.source || inquiry.source,
            status: customer.status === "lead" ? "active" : customer.status,
            notes: customer.notes,
            lastInquiryAt: inquiry.createdAt,
            updatedAt: inquiry.updatedAt
          }
        : customer
    );
  } else {
    data.customers.unshift({
      id: customerId,
      name: inquiry.name || inquiry.company || "Manual Inquiry",
      email: inquiry.email,
      whatsapp: inquiry.whatsapp,
      company: inquiry.company,
      country: inquiry.country,
      products: inquiry.product ? [inquiry.product] : [],
      source: inquiry.source,
      status: "lead",
      notes: "",
      lastInquiryAt: inquiry.createdAt,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt
    });
  }

  data.inquiries.unshift(inquiry);
  await writeCmsData(data, `Create CMS inquiry ${inquiry.name}`);
  return jsonOk(inquiry, 201);
}
