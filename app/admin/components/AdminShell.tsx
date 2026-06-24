"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import AdminLanguageSwitcher from "./AdminLanguageSwitcher";

const navItems = [
  ["Dashboard", "/admin/dashboard"],
  ["Pages", "/admin/pages"],
  ["Blog", "/admin/blog"],
  ["Products", "/admin/products"],
  ["Media", "/admin/media"],
  ["Settings", "/admin/settings"]
];

export default function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-body">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <img src="/assets/toknav-logo-white.png" alt="TOKNAV" />
            <small>CMS / SEO Admin</small>
          </div>
          <AdminLanguageSwitcher />
          <nav className="admin-nav" aria-label="Admin navigation">
            {navItems.map(([label, href]) => (
              <Link className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""} href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
            <small>{email}</small>
            <button type="button" onClick={logout}>Logout</button>
            <Link href="/" target="_blank">View Website</Link>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
