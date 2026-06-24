import { NextResponse } from "next/server";
import { authenticateAdmin, createFirstAdmin, hasAdminAccount, setSessionCookie } from "../../../../lib/cms/auth";
import { cleanString, jsonError, parseJsonBody } from "../../../../lib/cms/api";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function GET() {
  return NextResponse.json({ ok: true, hasAdmin: await hasAdminAccount() });
}

export async function POST(request: Request) {
  const body = await parseJsonBody<LoginBody>(request);
  if (!body) return jsonError("Invalid request body.");

  const email = cleanString(body.email, 160).toLowerCase();
  const password = cleanString(body.password, 200);
  if (!email || !password) return jsonError("Email and password are required.");
  if (password.length < 10) return jsonError("Password must be at least 10 characters.");

  const adminExists = await hasAdminAccount();
  const user = adminExists ? await authenticateAdmin(email, password) : await createFirstAdmin(email, password);
  if (!user) return jsonError("Invalid email or password.", 401);

  await setSessionCookie(user);
  return NextResponse.json({
    ok: true,
    data: {
      id: user.id,
      email: user.email,
      initialized: !adminExists
    }
  });
}
