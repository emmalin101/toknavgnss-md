import type { Metadata } from "next";
import type React from "react";
import { I18nProvider } from "./components/I18nProvider";
import SiteFooter from "./components/SiteFooter";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";
import "./admin/admin.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://toknavgnss.md"),
  title: "TOKNAV | GNSS Receivers & RTK Solutions Manufacturer",
  description: "TOKNAV manufactures GNSS receivers, RTK systems, antennas, CORS/VRS solutions, precision agriculture and machine control products for global B2B buyers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><I18nProvider>{children}<SiteFooter /><WhatsAppButton /></I18nProvider></body></html>;
}
