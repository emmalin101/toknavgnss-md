import { jsonError, jsonOk, normalizeBlogInput, parseJsonBody, requireAdminApi, validateRequired } from "../../../lib/cms/api";
import { readCmsData, writeCmsData } from "../../../lib/cms/storage";
import type { CmsBlogPost } from "../../../lib/cms/types";

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.blogPosts);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const body = await parseJsonBody<Partial<CmsBlogPost>>(request);
  if (!body) return jsonError("Invalid request body.");

  const post = normalizeBlogInput(body);
  const errors = validateRequired({ title: post.title, slug: post.slug });
  if (Object.keys(errors).length) return jsonError("Please complete required fields.", 400, errors);

  const data = await readCmsData();
  if (data.blogPosts.some((item) => item.slug === post.slug)) return jsonError("A blog post with this slug already exists.");

  data.blogPosts.unshift(post);
  await writeCmsData(data, `Create CMS blog ${post.title}`);
  return jsonOk(post, 201);
}
