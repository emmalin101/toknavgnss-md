import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { CONTACT_EMAILS, PRIMARY_CONTACT_EMAIL } from "../../lib/contactInfo";

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
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>WhatsApp:</strong> ${payload.whatsapp}</p>
    <p><strong>Company:</strong> ${payload.company || "-"}</p>
    <p><strong>Country / Region:</strong> ${payload.country || "-"}</p>
    <p><strong>Product Requirement:</strong> ${payload.product || "-"}</p>
    <p><strong>Message:</strong></p>
    <p>${payload.message || "-"}</p>
    <p><strong>Submitted At:</strong> ${payload.createdAt}</p>
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
      email: clean(body.email),
      whatsapp: clean(body.whatsapp),
      company: clean(body.company),
      country: clean(body.country),
      product: clean(body.product),
      message: clean(body.message),
      createdAt: new Date().toISOString()
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

    const dataDir = join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(join(dataDir, "inquiries.jsonl"), `${JSON.stringify(payload)}\n`, "utf8");

    // Optional email integration:
    // Add RESEND_API_KEY, INQUIRY_TO_EMAIL and INQUIRY_FROM_EMAIL in production.
    // Without RESEND_API_KEY, the inquiry is still stored in data/inquiries.jsonl.
    await sendInquiryEmail(payload);

    return NextResponse.json({ ok: true, message: "Inquiry submitted successfully." });
  } catch {
    return NextResponse.json(
      { ok: false, message: `Submission failed. Please email ${PRIMARY_CONTACT_EMAIL} directly.` },
      { status: 500 }
    );
  }
}
