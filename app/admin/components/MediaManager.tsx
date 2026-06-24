"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { CmsMediaItem } from "../../lib/cms/types";

export default function MediaManager() {
  const [items, setItems] = useState<CmsMediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/cms/media", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || "Failed to load media.");
    setItems(payload.data);
  }

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load media."));
  }, []);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setError("");
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt);
    const response = await fetch("/api/cms/media", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Upload failed.");
      return;
    }
    setItems((current) => [payload.data, ...current]);
    setFile(null);
    setAlt("");
    setMessage("Uploaded successfully.");
  }

  async function remove(item: CmsMediaItem) {
    if (!confirm(`Delete ${item.filename}?`)) return;
    const response = await fetch(`/api/cms/media/${item.id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Delete failed.");
      return;
    }
    setItems((current) => current.filter((media) => media.id !== item.id));
  }

  async function updateAlt(item: CmsMediaItem, nextAlt: string) {
    setItems((current) => current.map((media) => media.id === item.id ? { ...media, alt: nextAlt } : media));
    await fetch(`/api/cms/media/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: nextAlt })
    });
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>Media Library</h1>
          <p>Upload images, edit alt text and copy URLs for pages, blogs and products.</p>
        </div>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {message ? <div className="admin-success">{message}</div> : null}
      <form className="admin-card admin-form" onSubmit={upload} style={{ marginBottom: 18 }}>
        <div className="admin-field-grid">
          <label className="admin-field">
            <span>Image file</span>
            <input className="admin-input" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <label className="admin-field">
            <span>Alt text</span>
            <input className="admin-input" value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Describe the image for SEO" />
          </label>
        </div>
        <button className="admin-button" type="submit">Upload Image</button>
      </form>
      <div className="admin-media-grid">
        {items.map((item) => (
          <article className="admin-media-card" key={item.id}>
            <img src={item.url} alt={item.alt || item.filename} />
            <div>
              <strong>{item.filename}</strong>
              <input className="admin-input" value={item.alt || ""} onChange={(event) => updateAlt(item, event.target.value)} placeholder="Alt text" />
              <button className="admin-button-secondary" type="button" onClick={() => navigator.clipboard.writeText(item.url)}>Copy URL</button>
              <button className="admin-danger-button" type="button" onClick={() => remove(item)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
