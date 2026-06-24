import { jsonError, jsonOk, normalizeBlogInput, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../../lib/cms/storage";
import type { CmsBlogPost } from "../../../../lib/cms/types";

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
  const post = data.blogPosts.find((item) => item.id === id);
  if (!post) return jsonError("Blog post not found.", 404);
  return jsonOk(post);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<Partial<CmsBlogPost>>(request);
  if (!body) return jsonError("Invalid request body.");

  const data = await readCmsData();
  const index = data.blogPosts.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Blog post not found.", 404);

  const post = normalizeBlogInput(body, data.blogPosts[index]);
  if (data.blogPosts.some((item) => item.id !== id && item.slug === post.slug)) {
    return jsonError("Another blog post already uses this slug.");
  }

  data.blogPosts[index] = post;
  await writeCmsData(data, `Update CMS blog ${post.title}`);
  return jsonOk(post);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const post = data.blogPosts.find((item) => item.id === id);
  if (!post) return jsonError("Blog post not found.", 404);

  data.blogPosts = data.blogPosts.filter((item) => item.id !== id);
  await writeCmsData(data, `Delete CMS blog ${post.title}`);
  return jsonOk({ id });
}
