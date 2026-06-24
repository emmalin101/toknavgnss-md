import { cleanString, jsonError, jsonOk, parseJsonBody, requireAdminApi } from "../../../../lib/cms/api";
import { deleteUploadedMedia, readCmsData, writeCmsData } from "../../../../lib/cms/storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getId(context: RouteContext) {
  return (await context.params).id;
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const body = await parseJsonBody<{ alt?: string }>(request);
  const data = await readCmsData();
  const index = data.media.findIndex((item) => item.id === id);
  if (index < 0) return jsonError("Media item not found.", 404);

  data.media[index] = {
    ...data.media[index],
    alt: cleanString(body?.alt, 200),
    updatedAt: new Date().toISOString()
  };
  await writeCmsData(data, `Update CMS media ${data.media[index].filename}`);
  return jsonOk(data.media[index]);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const id = await getId(context);
  const data = await readCmsData();
  const media = data.media.find((item) => item.id === id);
  if (!media) return jsonError("Media item not found.", 404);

  await deleteUploadedMedia(media.url);
  data.media = data.media.filter((item) => item.id !== id);
  await writeCmsData(data, `Delete CMS media ${media.filename}`);
  return jsonOk({ id });
}
