"use client";

import { useEffect, useState } from "react";
import type { CmsBlogPost, CmsMediaItem, CmsPage, CmsProduct } from "../../lib/cms/types";

type Counts = {
  pages: CmsPage[];
  blogPosts: CmsBlogPost[];
  products: CmsProduct[];
  media: CmsMediaItem[];
};

const empty: Counts = { pages: [], blogPosts: [], products: [], media: [] };

async function loadResource<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || "Failed to load CMS data.");
  return payload.data as T;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Counts>(empty);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    Promise.all([
      loadResource<CmsPage[]>("/api/cms/pages"),
      loadResource<CmsBlogPost[]>("/api/cms/blog"),
      loadResource<CmsProduct[]>("/api/cms/products"),
      loadResource<CmsMediaItem[]>("/api/cms/media")
    ])
      .then(([pages, blogPosts, products, media]) => setData({ pages, blogPosts, products, media }))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."));
  }, []);

  const stats = [
    ["Pages", data.pages.length],
    ["Blog Posts", data.blogPosts.length],
    ["Products", data.products.length],
    ["Media", data.media.length]
  ];

  async function syncCurrentWebsite() {
    setError("");
    setSyncMessage("");
    setSyncing(true);
    try {
      const response = await fetch("/api/cms/sync-current", { method: "POST" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Sync failed.");
      setSyncMessage(`Synced: ${payload.data.pagesAdded} pages added, ${payload.data.productsAdded} products added, ${payload.data.productsUpdated} products updated.`);
      const [pages, blogPosts, products, media] = await Promise.all([
        loadResource<CmsPage[]>("/api/cms/pages"),
        loadResource<CmsBlogPost[]>("/api/cms/blog"),
        loadResource<CmsProduct[]>("/api/cms/products"),
        loadResource<CmsMediaItem[]>("/api/cms/media")
      ]);
      setData({ pages, blogPosts, products, media });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>Dashboard</h1>
          <p>Manage TOKNAV website content, SEO, products, blog posts and media from one place.</p>
        </div>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {syncMessage ? <div className="admin-success">{syncMessage}</div> : null}
      <section className="admin-stats-grid">
        {stats.map(([label, value]) => (
          <article className="admin-card admin-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
      <section className="admin-grid" style={{ marginTop: 18 }}>
        <a className="admin-card" href="/admin/pages/new">
          <h2>Edit Page Content</h2>
          <p className="admin-muted">Hero text, images, CTA blocks, SEO title and description.</p>
        </a>
        <a className="admin-card" href="/admin/blog/new">
          <h2>Add Blog</h2>
          <p className="admin-muted">Create SEO posts with slug, cover image, tags and metadata.</p>
        </a>
        <a className="admin-card" href="/admin/products/new">
          <h2>Add Product</h2>
          <p className="admin-muted">Publish product pages with specs, gallery and inquiry content.</p>
        </a>
        <a className="admin-card" href="/admin/media">
          <h2>Upload Media</h2>
          <p className="admin-muted">Manage product photos, blog covers and SEO image alt text.</p>
        </a>
        <button className="admin-card admin-card-button" type="button" onClick={syncCurrentWebsite} disabled={syncing}>
          <h2>{syncing ? "Syncing..." : "Sync Current Website Content"}</h2>
          <p className="admin-muted">Import all visible pages and product model data into the CMS for editing.</p>
        </button>
      </section>
    </>
  );
}
