import { createAdminUser, listAdminUsers } from "../../../../lib/cms/auth";
import { cleanString, jsonError, jsonOk, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";

type AdminUserInput = {
  email?: string;
  password?: string;
};

function publicAdminUser(user: Awaited<ReturnType<typeof listAdminUsers>>[number]) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const users = await listAdminUsers();
  return jsonOk(users.map(publicAdminUser));
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<AdminUserInput>(request);
  const email = cleanString(body?.email, 180).toLowerCase();
  const password = cleanString(body?.password, 200);
  if (!isEmail(email)) return jsonError("Please enter a valid admin email.");
  if (password.length < 10) return jsonError("Password must be at least 10 characters.");

  try {
    const user = await createAdminUser(email, password);
    return jsonOk(publicAdminUser(user), 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Failed to create admin user.");
  }
}
