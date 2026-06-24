import { NextResponse } from "next/server";
import { updateAdminPassword } from "../../../../lib/cms/auth";
import { cleanString, jsonError, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";

type PasswordBody = {
  password?: string;
};

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<PasswordBody>(request);
  const password = cleanString(body?.password, 200);
  if (password.length < 10) return jsonError("Password must be at least 10 characters.");

  await updateAdminPassword(admin.sub, password);
  return NextResponse.json({ ok: true });
}
