"use client";

import { useEffect, useState } from "react";
import type { CmsSettings } from "../../lib/cms/types";
import { CONTACT_PHONE, PRIMARY_CONTACT_EMAIL, SALES_CONTACT_EMAIL, WHATSAPP_PHONE } from "../../lib/contactInfo";

const emptySettings: Partial<CmsSettings> = {
  siteName: "TOKNAV",
  logo: "/assets/toknav-logo-blue.png",
  favicon: "/favicon.ico",
  defaultSeoTitle: "",
  defaultSeoDescription: "",
  socialLinks: { facebook: "", instagram: "", linkedin: "", youtube: "" },
  contactEmail: PRIMARY_CONTACT_EMAIL,
  contactEmailSecondary: SALES_CONTACT_EMAIL,
  contactPhone: CONTACT_PHONE,
  whatsappPhone: WHATSAPP_PHONE,
  footerText: ""
};

const emptySocialLinks: CmsSettings["socialLinks"] = {
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: ""
};

export default function SettingsEditor() {
  const [settings, setSettings] = useState<Partial<CmsSettings>>(emptySettings);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms/settings")
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || "Failed to load settings.");
        setSettings(payload.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings."));
  }, []);

  function update<K extends keyof CmsSettings>(key: K, value: CmsSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updateSocial(key: keyof CmsSettings["socialLinks"], value: string) {
    setSettings((current) => ({
      ...current,
      socialLinks: { ...emptySocialLinks, ...current.socialLinks, [key]: value }
    }));
  }

  async function saveSettings() {
    setError("");
    setMessage("");
    const response = await fetch("/api/cms/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Save failed.");
      return;
    }
    setSettings(payload.data);
    setMessage("Settings saved.");
  }

  async function changePassword() {
    setError("");
    setMessage("");
    const response = await fetch("/api/cms/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Password update failed.");
      return;
    }
    setPassword("");
    setMessage("Password updated.");
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>Settings</h1>
          <p>Manage global website SEO, branding, social links and admin password.</p>
        </div>
        <button className="admin-button" type="button" onClick={saveSettings}>Save Settings</button>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {message ? <div className="admin-success">{message}</div> : null}
      <div className="admin-editor">
        <section className="admin-editor-panel">
          <div className="admin-field-grid">
            <label className="admin-field"><span>Website name</span><input className="admin-input" value={settings.siteName || ""} onChange={(event) => update("siteName", event.target.value)} /></label>
            <label className="admin-field"><span>Primary inquiry email</span><input className="admin-input" value={settings.contactEmail || ""} onChange={(event) => update("contactEmail", event.target.value)} /></label>
            <label className="admin-field"><span>Secondary inquiry email</span><input className="admin-input" value={settings.contactEmailSecondary || ""} onChange={(event) => update("contactEmailSecondary", event.target.value)} /></label>
            <label className="admin-field"><span>Phone</span><input className="admin-input" value={settings.contactPhone || ""} onChange={(event) => update("contactPhone", event.target.value)} /></label>
            <label className="admin-field"><span>WhatsApp</span><input className="admin-input" value={settings.whatsappPhone || ""} onChange={(event) => update("whatsappPhone", event.target.value)} /></label>
            <label className="admin-field"><span>Logo URL</span><input className="admin-input" value={settings.logo || ""} onChange={(event) => update("logo", event.target.value)} /></label>
            <label className="admin-field"><span>Favicon URL</span><input className="admin-input" value={settings.favicon || ""} onChange={(event) => update("favicon", event.target.value)} /></label>
          </div>
          <label className="admin-field"><span>Default SEO title</span><input className="admin-input" value={settings.defaultSeoTitle || ""} onChange={(event) => update("defaultSeoTitle", event.target.value)} /></label>
          <label className="admin-field"><span>Default SEO description</span><textarea className="admin-textarea" value={settings.defaultSeoDescription || ""} onChange={(event) => update("defaultSeoDescription", event.target.value)} /></label>
          <label className="admin-field"><span>Footer text</span><textarea className="admin-textarea" value={settings.footerText || ""} onChange={(event) => update("footerText", event.target.value)} /></label>
          <div className="admin-field-grid">
            <label className="admin-field"><span>Facebook</span><input className="admin-input" value={settings.socialLinks?.facebook || ""} onChange={(event) => updateSocial("facebook", event.target.value)} /></label>
            <label className="admin-field"><span>Instagram</span><input className="admin-input" value={settings.socialLinks?.instagram || ""} onChange={(event) => updateSocial("instagram", event.target.value)} /></label>
            <label className="admin-field"><span>LinkedIn</span><input className="admin-input" value={settings.socialLinks?.linkedin || ""} onChange={(event) => updateSocial("linkedin", event.target.value)} /></label>
            <label className="admin-field"><span>YouTube</span><input className="admin-input" value={settings.socialLinks?.youtube || ""} onChange={(event) => updateSocial("youtube", event.target.value)} /></label>
          </div>
        </section>
        <aside className="admin-editor-panel">
          <h2>Change Password</h2>
          <p className="admin-muted">Use at least 10 characters. The password is stored as a hash.</p>
          <input className="admin-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" />
          <button className="admin-button-secondary" type="button" onClick={changePassword}>Update Password</button>
        </aside>
      </div>
    </>
  );
}
