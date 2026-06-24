import crypto from "node:crypto";
import { cookies } from "next/headers";
import { createId, nowIso } from "./defaults";
import { readAuthStore, writeAuthStore } from "./storage";
import type { CmsAdminUser } from "./types";

export const CMS_SESSION_COOKIE = "cms_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

function getSessionSecret() {
  if (process.env.CMS_SESSION_SECRET) return process.env.CMS_SESSION_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("CMS_SESSION_SECRET is required in production.");
  return "local-development-cms-session-secret";
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [method, salt, hash] = storedHash.split("$");
  if (method !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = crypto.scryptSync(password, salt, expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function listAdminUsers() {
  const store = await readAuthStore();
  const envEmail = process.env.CMS_ADMIN_EMAIL;
  const envHash = process.env.CMS_ADMIN_PASSWORD_HASH;
  if (!store.users.length && envEmail && envHash) {
    return [
      {
        id: "env-admin",
        email: envEmail,
        passwordHash: envHash,
        createdAt: nowIso(),
        updatedAt: nowIso()
      }
    ];
  }
  return store.users;
}

export async function createFirstAdmin(email: string, password: string) {
  const store = await readAuthStore();
  if (store.users.length > 0) throw new Error("Admin account already exists.");

  const now = nowIso();
  const user: CmsAdminUser = {
    id: createId("admin"),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now
  };

  store.users = [user];
  await writeAuthStore(store, "Initialize CMS admin account");
  return user;
}

export async function updateAdminPassword(userId: string, password: string) {
  const store = await readAuthStore();
  const users = store.users.length
    ? store.users
    : process.env.CMS_ADMIN_EMAIL && process.env.CMS_ADMIN_PASSWORD_HASH
      ? [
          {
            id: userId,
            email: process.env.CMS_ADMIN_EMAIL,
            passwordHash: process.env.CMS_ADMIN_PASSWORD_HASH,
            createdAt: nowIso(),
            updatedAt: nowIso()
          }
        ]
      : [];
  const index = users.findIndex((user) => user.id === userId || user.email === userId);
  if (index < 0) throw new Error("Admin user not found.");

  users[index] = {
    ...users[index],
    passwordHash: hashPassword(password),
    updatedAt: nowIso()
  };
  store.users = users;
  await writeAuthStore(store, "Change CMS admin password");
  return users[index];
}

export async function authenticateAdmin(email: string, password: string) {
  const users = await listAdminUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export function createSessionToken(user: Pick<CmsAdminUser, "id" | "email">) {
  const payload = {
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      sub: string;
      email: string;
      exp: number;
    };
    if (!payload.sub || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function getCookieStore() {
  return await cookies();
}

export async function getCurrentAdmin() {
  const cookieStore = await getCookieStore();
  return verifySessionToken(cookieStore.get(CMS_SESSION_COOKIE)?.value);
}

export async function setSessionCookie(user: Pick<CmsAdminUser, "id" | "email">) {
  const cookieStore = await getCookieStore();
  cookieStore.set(CMS_SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds
  });
}

export async function clearSessionCookie() {
  const cookieStore = await getCookieStore();
  cookieStore.set(CMS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function hasAdminAccount() {
  const users = await listAdminUsers();
  return users.length > 0;
}
