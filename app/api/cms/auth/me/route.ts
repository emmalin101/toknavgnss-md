import { NextResponse } from "next/server";
import { getCurrentAdmin, hasAdminAccount } from "../../../../lib/cms/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({
    ok: true,
    hasAdmin: await hasAdminAccount(),
    data: admin ? { id: admin.sub, email: admin.email } : null
  });
}
