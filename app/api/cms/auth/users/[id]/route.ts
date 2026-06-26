import { deleteAdminUser, updateAdminPassword } from "../../../../../lib/cms/auth";
import { cleanString, jsonError, jsonOk, parseJsonBody, requireAdminApi } from "../../../../../lib/cms/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type PasswordBody = {
  password?: string;
};

async function getId(context: RouteContext) {
  return (await context.params).id;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<PasswordBody>(request);
  const password = cleanString(body?.password, 200);
  if (password.length < 10) return jsonError("Password must be at least 10 characters.");

  try {
    const user = await updateAdminPassword(id, password);
    return jsonOk({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Password update failed.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);

  try {
    const user = await deleteAdminUser(id, admin.sub);
    return jsonOk({ id: user.id });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Failed to delete admin user.");
  }
}
