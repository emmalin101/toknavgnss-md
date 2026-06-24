import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ensureAuthStoreShape, ensureCmsDataShape, nowIso } from "./defaults";
import type { CmsAuthStore, CmsData } from "./types";

const dataFilePath = path.join(process.cwd(), "content", "cms-data.json");
const authFilePath = path.join(process.cwd(), "content", "cms-auth.json");
const uploadRoot = path.join(process.cwd(), "public", "uploads");

type GithubFile = {
  content?: string;
  sha?: string;
};

function useGithubStorage() {
  return process.env.CMS_STORAGE_MODE === "github" && Boolean(getGithubToken() && getGithubRepo());
}

function getGithubToken() {
  return process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
}

function getGithubRepo() {
  return process.env.CMS_GITHUB_REPO || process.env.GITHUB_REPO || "";
}

function getGithubBranch() {
  return process.env.CMS_GITHUB_BRANCH || process.env.GITHUB_BRANCH || "main";
}

function githubApiUrl(filePath: string) {
  const repo = getGithubRepo();
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repo}/contents/${encodedPath}`;
}

async function githubRequest(filePath: string) {
  const url = `${githubApiUrl(filePath)}?ref=${encodeURIComponent(getGithubBranch())}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getGithubToken()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    cache: "no-store"
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed for ${filePath}.`);
  return (await response.json()) as GithubFile;
}

async function readGithubJson<T>(filePath: string, fallback: T) {
  const file = await githubRequest(filePath);
  if (!file?.content) return fallback;
  const decoded = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
  return JSON.parse(decoded) as T;
}

async function writeGithubFile(filePath: string, content: Buffer | string, message: string) {
  const existing = await githubRequest(filePath);
  const body: Record<string, string> = {
    message,
    branch: getGithubBranch(),
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64")
  };
  if (existing?.sha) body.sha = existing.sha;

  const response = await fetch(githubApiUrl(filePath), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getGithubToken()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub write failed for ${filePath}: ${text}`);
  }
}

async function deleteGithubFile(filePath: string, message: string) {
  const existing = await githubRequest(filePath);
  if (!existing?.sha) return;

  const response = await fetch(githubApiUrl(filePath), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getGithubToken()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      message,
      branch: getGithubBranch(),
      sha: existing.sha
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub delete failed for ${filePath}: ${text}`);
  }
}

export async function readCmsData(): Promise<CmsData> {
  if (useGithubStorage()) {
    return ensureCmsDataShape(await readGithubJson<CmsData>("content/cms-data.json", ensureCmsDataShape(null)));
  }

  if (!existsSync(dataFilePath)) return ensureCmsDataShape(null);
  const raw = await readFile(dataFilePath, "utf8");
  return ensureCmsDataShape(JSON.parse(raw));
}

export function readCmsDataSync(): CmsData {
  if (!existsSync(dataFilePath)) return ensureCmsDataShape(null);
  try {
    return ensureCmsDataShape(JSON.parse(readFileSync(dataFilePath, "utf8")));
  } catch {
    return ensureCmsDataShape(null);
  }
}

export async function writeCmsData(data: CmsData, message = "Update CMS content") {
  const normalized = ensureCmsDataShape({ ...data, updatedAt: nowIso() });
  const json = `${JSON.stringify(normalized, null, 2)}\n`;

  if (useGithubStorage()) {
    await writeGithubFile("content/cms-data.json", json, message);
    return normalized;
  }

  await mkdir(path.dirname(dataFilePath), { recursive: true });
  await writeFile(dataFilePath, json, "utf8");
  return normalized;
}

export async function readAuthStore(): Promise<CmsAuthStore> {
  if (useGithubStorage()) {
    return ensureAuthStoreShape(await readGithubJson<CmsAuthStore>("content/cms-auth.json", ensureAuthStoreShape(null)));
  }

  if (!existsSync(authFilePath)) return ensureAuthStoreShape(null);
  const raw = await readFile(authFilePath, "utf8");
  return ensureAuthStoreShape(JSON.parse(raw));
}

export async function writeAuthStore(data: CmsAuthStore, message = "Update CMS admin auth") {
  const normalized = ensureAuthStoreShape({ ...data, updatedAt: nowIso() });
  const json = `${JSON.stringify(normalized, null, 2)}\n`;

  if (useGithubStorage()) {
    await writeGithubFile("content/cms-auth.json", json, message);
    return normalized;
  }

  await mkdir(path.dirname(authFilePath), { recursive: true });
  await writeFile(authFilePath, json, "utf8");
  return normalized;
}

export function safeUploadName(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "upload"}-${Date.now()}${ext}`;
}

export async function saveUploadedMedia(filename: string, bytes: Buffer) {
  const date = new Date();
  const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  const safeName = safeUploadName(filename);
  const repoPath = `public/uploads/${folder}/${safeName}`;
  const publicUrl = `/uploads/${folder}/${safeName}`;

  if (useGithubStorage()) {
    await writeGithubFile(repoPath, bytes, `Upload CMS media ${safeName}`);
    return { url: publicUrl, filename: safeName };
  }

  const localDir = path.join(uploadRoot, folder);
  await mkdir(localDir, { recursive: true });
  await writeFile(path.join(localDir, safeName), bytes);
  return { url: publicUrl, filename: safeName };
}

export async function deleteUploadedMedia(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const relative = url.replace(/^\/+/, "");
  if (relative.includes("..")) return;

  if (useGithubStorage()) {
    await deleteGithubFile(`public/${relative}`, `Delete CMS media ${path.basename(relative)}`);
    return;
  }

  const localPath = path.join(process.cwd(), "public", relative);
  if (!localPath.startsWith(uploadRoot)) return;
  if (existsSync(localPath)) await unlink(localPath);
}
