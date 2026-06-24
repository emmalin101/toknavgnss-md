import { createId, nowIso } from "../../../lib/cms/defaults";
import { cleanString, jsonError, jsonOk, requireAdminApi } from "../../../lib/cms/api";
import { readCmsData, saveUploadedMedia, writeCmsData } from "../../../lib/cms/storage";
import type { CmsMediaItem } from "../../../lib/cms/types";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

function maxUploadBytes() {
  const mb = Number(process.env.CMS_MAX_UPLOAD_MB || "5");
  return Math.max(1, Math.min(20, mb)) * 1024 * 1024;
}

function isSafeSvg(bytes: Buffer) {
  const text = bytes.toString("utf8").toLowerCase();
  return !text.includes("<script") && !text.includes("javascript:") && !/\son[a-z]+\s*=/.test(text);
}

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const data = await readCmsData();
  return jsonOk(data.media);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return jsonError("Unauthorized.", 401);

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("Please choose an image file.");
  if (!allowedTypes.has(file.type)) return jsonError("Only jpg, jpeg, png, webp, gif and safe svg images are allowed.");
  if (file.size > maxUploadBytes()) return jsonError(`Image must be smaller than ${process.env.CMS_MAX_UPLOAD_MB || 5}MB.`);

  const bytes = Buffer.from(await file.arrayBuffer());
  if (file.type === "image/svg+xml" && !isSafeSvg(bytes)) return jsonError("SVG contains unsafe code and was rejected.");

  const saved = await saveUploadedMedia(file.name, bytes);
  const now = nowIso();
  const media: CmsMediaItem = {
    id: createId("media"),
    url: saved.url,
    filename: saved.filename,
    mimeType: file.type,
    size: file.size,
    alt: cleanString(formData.get("alt"), 200),
    createdAt: now,
    updatedAt: now
  };

  const data = await readCmsData();
  data.media.unshift(media);
  await writeCmsData(data, `Upload CMS media ${media.filename}`);
  return jsonOk(media, 201);
}
