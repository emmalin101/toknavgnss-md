import { redirect } from "next/navigation";
import type React from "react";
import { getCurrentAdmin } from "../../lib/cms/auth";
import AdminShell from "../components/AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
