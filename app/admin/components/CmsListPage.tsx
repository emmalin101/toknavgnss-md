"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Resource = "pages" | "blog" | "products";

type Item = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  path?: string;
  status?: string;
  updatedAt?: string;
};

const labels: Record<Resource, { title: string; create: string; endpoint: string; base: string }> = {
  pages: { title: "Pages", create: "New Page", endpoint: "/api/cms/pages", base: "/admin/pages" },
  blog: { title: "Blog", create: "New Blog Post", endpoint: "/api/cms/blog", base: "/admin/blog" },
  products: { title: "Products", create: "New Product", endpoint: "/api/cms/products", base: "/admin/products" }
};

export default function CmsListPage({ resource }: { resource: Resource }) {
  const config = labels[resource];
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const response = await fetch(config.endpoint, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Failed to load data.");
      setItems(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const response = await fetch(`${config.endpoint}/${id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Delete failed.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>{config.title}</h1>
          <p>Edit draft and published content without touching code.</p>
        </div>
        <Link className="admin-button" href={`${config.base}/new`}>{config.create}</Link>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      <div className="admin-list">
        {items.map((item) => (
          <article className="admin-list-card" key={item.id}>
            <div>
              <h2>{item.title || item.name || "Untitled"}</h2>
              <span className="admin-pill">{item.status || "draft"}</span>
              <span className="admin-muted">{item.path || item.slug || item.id}</span>
            </div>
            <div className="admin-actions">
              <Link className="admin-button-secondary" href={`${config.base}/${item.id}/edit`}>Edit</Link>
              <button className="admin-danger-button" type="button" onClick={() => remove(item.id)}>Delete</button>
            </div>
          </article>
        ))}
        {!items.length ? <div className="admin-card">No content yet. Create the first item.</div> : null}
      </div>
    </>
  );
}
