"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsMediaItem, CmsProduct, CmsProductSpec } from "../../lib/cms/types";

const categoryOptions = [
  ["gnss-receivers", "GNSS Receivers"],
  ["rugged-gis", "Rugged & GIS"],
  ["gnss-antennas", "GNSS Antennas"],
  ["precision-agriculture-machine-control", "Precision Agriculture & Machine Control"],
  ["accessories", "Accessories"],
  ["gnss-application-solutions", "GNSS Application Solutions"]
];

const emptyProduct: Partial<CmsProduct> = {
  name: "",
  slug: "",
  type: "",
  summary: "",
  description: "",
  price: "",
  image: "",
  gallery: [],
  category: "gnss-receivers",
  tags: [],
  applications: [],
  highlights: [],
  specs: [],
  status: "draft",
  featured: false,
  seoTitle: "",
  seoDescription: ""
};

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanEditableSpecs(specs: CmsProductSpec[] | undefined) {
  return (specs || []).filter((spec) => spec.label.trim() || spec.value.trim());
}

export default function ProductEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Partial<CmsProduct>>(emptyProduct);
  const [media, setMedia] = useState<CmsMediaItem[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const isEditing = Boolean(id);

  useEffect(() => {
    fetch("/api/cms/media")
      .then((response) => response.json())
      .then((payload) => payload.ok && setMedia(payload.data))
      .catch(() => undefined);

    if (!id) return;
    fetch(`/api/cms/products/${id}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || "Failed to load product.");
        setProduct(payload.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load product."));
  }, [id]);

  function update<K extends keyof CmsProduct>(key: K, value: CmsProduct[K]) {
    setProduct((current) => ({ ...current, [key]: value }));
  }

  function updateSpec(index: number, key: keyof CmsProductSpec, value: string) {
    const next = [...(product.specs || [])];
    while (next.length <= index) next.push({ label: "", value: "" });
    next[index] = { ...next[index], [key]: value };
    update("specs", next);
  }

  function addSpec() {
    update("specs", [...(product.specs || []), { label: "", value: "" }]);
  }

  function removeSpec(index: number) {
    update("specs", (product.specs || []).filter((_, itemIndex) => itemIndex !== index));
  }

  async function save(status?: "draft" | "published") {
    setError("");
    setMessage("");
    const payload = { ...product, status: status || product.status || "draft" };
    const response = await fetch(isEditing ? `/api/cms/products/${id}` : "/api/cms/products", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      setError(result.message || "Save failed.");
      return;
    }
    setMessage("Saved successfully.");
    setProduct(result.data);
    if (!isEditing) router.replace(`/admin/products/${result.data.id}/edit`);
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>{isEditing ? "Edit Product" : "New Product"}</h1>
          <p>Manage product specs, gallery, category, SEO and inquiry landing content.</p>
        </div>
        <div className="admin-actions">
          <button className="admin-button-secondary" type="button" onClick={() => save("draft")}>Save Draft</button>
          <button className="admin-button" type="button" onClick={() => save("published")}>Publish</button>
        </div>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {message ? <div className="admin-success">{message}</div> : null}
      <div className="admin-editor">
        <section className="admin-editor-panel">
          <div className="admin-field-grid">
            <label className="admin-field"><span>Name</span><input className="admin-input" value={product.name || ""} onChange={(event) => update("name", event.target.value)} /></label>
            <label className="admin-field"><span>Slug</span><input className="admin-input" value={product.slug || ""} onChange={(event) => update("slug", event.target.value)} /></label>
            <label className="admin-field"><span>Product type / kicker</span><input className="admin-input" value={product.type || ""} onChange={(event) => update("type", event.target.value)} placeholder="Entry RTK receiver" /></label>
            <label className="admin-field"><span>Category</span><select className="admin-select" value={product.category || "gnss-receivers"} onChange={(event) => update("category", event.target.value)}>{categoryOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label className="admin-field"><span>Price, optional</span><input className="admin-input" value={product.price || ""} onChange={(event) => update("price", event.target.value)} placeholder="Leave blank for quote" /></label>
            <label className="admin-field"><span>Status</span><select className="admin-select" value={product.status || "draft"} onChange={(event) => update("status", event.target.value as CmsProduct["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            <label className="admin-field"><span>Featured</span><select className="admin-select" value={product.featured ? "yes" : "no"} onChange={(event) => update("featured", event.target.value === "yes")}><option value="no">No</option><option value="yes">Yes</option></select></label>
          </div>
          <div className="admin-help-card">
            <strong>Where does this appear on the website?</strong>
            <p>Main image, product type, summary, description, applications, highlights and specs are shown on the product category card and product detail page after publishing.</p>
          </div>
          <label className="admin-field"><span>Short summary shown on cards and hero</span><textarea className="admin-textarea" value={product.summary || ""} onChange={(event) => update("summary", event.target.value)} /></label>
          <label className="admin-field"><span>Detailed product page description</span><textarea className="admin-textarea" style={{ minHeight: 220 }} value={product.description || ""} onChange={(event) => update("description", event.target.value)} /></label>
          <label className="admin-field"><span>Applications, one per line</span><textarea className="admin-textarea" value={(product.applications || []).join("\n")} onChange={(event) => update("applications", linesToArray(event.target.value))} placeholder={"Surveying\nRoad construction\nDealer demo kit"} /></label>
          <label className="admin-field"><span>Highlights / selling points, one per line</span><textarea className="admin-textarea" value={(product.highlights || []).join("\n")} onChange={(event) => update("highlights", linesToArray(event.target.value))} placeholder={"Multi-constellation tracking\nIMU tilt measurement\nRugged field housing"} /></label>
          <div className="admin-field">
            <span>Specs / parameters</span>
            <div className="admin-spec-list">
              {(product.specs?.length ? product.specs : [{ label: "", value: "" }]).map((spec, index) => (
                <div className="admin-spec-row" key={index}>
                  <input
                    className="admin-input"
                    value={spec.label}
                    onChange={(event) => updateSpec(index, "label", event.target.value)}
                    placeholder="Parameter name, e.g. Protection"
                  />
                  <input
                    className="admin-input"
                    value={spec.value}
                    onChange={(event) => updateSpec(index, "value", event.target.value)}
                    placeholder="Parameter value, e.g. IP68"
                  />
                  <button className="admin-danger-button" type="button" onClick={() => removeSpec(index)}>Delete</button>
                </div>
              ))}
            </div>
            <div className="admin-actions">
              <button className="admin-button-secondary" type="button" onClick={addSpec}>Add parameter</button>
              <button className="admin-button-secondary" type="button" onClick={() => update("specs", cleanEditableSpecs(product.specs))}>Remove blank rows</button>
            </div>
            <small className="admin-muted">Only rows with both parameter name and value will appear on the website. Blank rows are removed after publishing.</small>
          </div>
          <label className="admin-field"><span>SEO tags, comma separated</span><input className="admin-input" value={(product.tags || []).join(", ")} onChange={(event) => update("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
          <label className="admin-field"><span>Gallery URLs, one per line</span><textarea className="admin-textarea" value={(product.gallery || []).join("\n")} onChange={(event) => update("gallery", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></label>
          <label className="admin-field"><span>SEO title</span><input className="admin-input" value={product.seoTitle || ""} onChange={(event) => update("seoTitle", event.target.value)} /></label>
          <label className="admin-field"><span>SEO description</span><textarea className="admin-textarea" value={product.seoDescription || ""} onChange={(event) => update("seoDescription", event.target.value)} /></label>
        </section>
        <aside className="admin-editor-panel">
          <label className="admin-field">
            <span>Main image</span>
            <input className="admin-input" value={product.image || ""} onChange={(event) => update("image", event.target.value)} />
            <select className="admin-select" value={product.image || ""} onChange={(event) => update("image", event.target.value)}>
              <option value="">Choose media</option>
              {media.map((item) => <option value={item.url} key={item.id}>{item.filename}</option>)}
            </select>
          </label>
          {product.image ? <img src={product.image} alt="" style={{ width: "100%", borderRadius: 12 }} /> : null}
          {product.slug && product.category ? <a className="admin-button-secondary" href={`/products/${product.category}/${product.slug}`} target="_blank">Open Preview</a> : null}
          <a className="admin-button-secondary" href="/admin/media">Open Media Library</a>
        </aside>
      </div>
    </>
  );
}
