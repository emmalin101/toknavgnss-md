import { NextResponse } from "next/server";
import { CONTACT_EMAILS, PRIMARY_CONTACT_EMAIL } from "../../lib/contactInfo";
import { createId, nowIso } from "../../lib/cms/defaults";
import { readCmsData, writeCmsData } from "../../lib/cms/storage";
import type { CmsCustomer, CmsInquiry } from "../../lib/cms/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[0-9 ()-]{7,22}$/;

type InquiryPayload = {
  name?: string;
  email?: string;
  whatsapp?: string;
  company?: string;
  country?: string;
  product?: string;
  message?: string;
  website?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function mergeProducts(existing: string[], product: string) {
  const products = [...existing];
  if (product && !products.includes(product)) products.unshift(product);
  return products.slice(0, 64);
}

function findExistingCustomer(customers: CmsCustomer[], email: string, whatsapp: string) {
  const normalizedEmail = email.toLowerCase();
  const normalizedWhatsapp = whatsapp.replace(/\s+/g, "");
  return customers.find((customer) => {
    const customerWhatsapp = customer.whatsapp.replace(/\s+/g, "");
    return Boolean(
      (normalizedEmail && customer.email.toLowerCase() === normalizedEmail) ||
      (normalizedWhatsapp && customerWhatsapp === normalizedWhatsapp)
    );
  });
}

async function sendInquiryEmail(payload: {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  country: string;
  product: string;
  message: string;
  createdAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmails = (process.env.INQUIRY_TO_EMAIL || CONTACT_EMAILS.join(","))
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "TOKNAV Website <onboarding@resend.dev>";

  if (!apiKey) return;

  const html = `
    <h2>New TOKNAV Website Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(payload.whatsapp)}</p>
    <p><strong>Company:</strong> ${escapeHtml(payload.company || "-")}</p>
    <p><strong>Country / Region:</strong> ${escapeHtml(payload.country || "-")}</p>
    <p><strong>Product Requirement:</strong> ${escapeHtml(payload.product || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message || "-").replace(/\n/g, "<br />")}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(payload.createdAt)}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmails,
      reply_to: payload.email,
      subject: `New TOKNAV Inquiry from ${payload.name}`,
      html
    })
  });

  if (!response.ok) {
    throw new Error("Email delivery failed.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;

    if (clean(body.website)) {
      return NextResponse.json({ ok: true, message: "Inquiry received." });
    }

    const payload = {
      name: clean(body.name),
      email: clean(body.email).toLowerCase(),
      whatsapp: clean(body.whatsapp),
      company: clean(body.company),
      country: clean(body.country),
      product: clean(body.product),
      message: clean(body.message),
      createdAt: nowIso()
    };

    const errors: Record<string, string> = {};
    if (!payload.name) errors.name = "Name is required.";
    if (!payload.email) errors.email = "Email is required.";
    if (payload.email && !emailPattern.test(payload.email)) errors.email = "Invalid email format.";
    if (!payload.whatsapp) errors.whatsapp = "WhatsApp is required.";
    if (payload.whatsapp && !whatsappPattern.test(payload.whatsapp)) errors.whatsapp = "Invalid WhatsApp format.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, message: "Please complete the required fields.", errors },
        { status: 400 }
      );
    }

    const data = await readCmsData();
    const customerMatch = findExistingCustomer(data.customers, payload.email, payload.whatsapp);
    const isRepeatCustomer = Boolean(customerMatch);
    const customerId = customerMatch?.id || createId("customer");

    const inquiry: CmsInquiry = {
      id: createId("inquiry"),
      ...payload,
      source: "website",
      status: "new",
      customerId,
      notes: "",
      updatedAt: payload.createdAt
    };

    if (customerMatch) {
      data.customers = data.customers.map((customer) =>
        customer.id === customerMatch.id
          ? {
              ...customer,
              name: payload.name || customer.name,
              email: payload.email || customer.email,
              whatsapp: payload.whatsapp || customer.whatsapp,
              company: payload.company || customer.company,
              country: payload.country || customer.country,
              products: mergeProducts(customer.products || [], payload.product),
              status: customer.status === "lead" ? "active" : customer.status,
              lastInquiryAt: payload.createdAt,
              updatedAt: payload.createdAt
            }
          : customer
      );
    } else {
      data.customers.unshift({
        id: customerId,
        name: payload.name || payload.company || "Website Inquiry",
        email: payload.email,
        whatsapp: payload.whatsapp,
        company: payload.company,
        country: payload.country,
        products: payload.product ? [payload.product] : [],
        source: "website",
        status: "lead",
        notes: "",
        lastInquiryAt: payload.createdAt,
        createdAt: payload.createdAt,
        updatedAt: payload.createdAt
      });
    }

    data.inquiries.unshift(inquiry);
    await writeCmsData(data, `Capture website inquiry from ${payload.name}${isRepeatCustomer ? " (repeat)" : ""}`);

    // Optional email integration:
    // Add RESEND_API_KEY, INQUIRY_TO_EMAIL and INQUIRY_FROM_EMAIL in production.
    // Without RESEND_API_KEY, the inquiry is still stored in the CMS.
    try {
      await sendInquiryEmail(payload);
    } catch (emailError) {
      console.error("Inquiry email delivery failed", emailError);
    }

    return NextResponse.json({ ok: true, message: "Inquiry submitted successfully." });
  } catch {
    return NextResponse.json(
      { ok: false, message: `Submission failed. Please email ${PRIMARY_CONTACT_EMAIL} directly.` },
      { status: 500 }
    );
  }
}
