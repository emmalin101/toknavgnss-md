"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsBlogPost, CmsMediaItem } from "../../lib/cms/types";

const emptyPost: Partial<CmsBlogPost> = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  coverImage: "",
  category: "GNSS",
  tags: [],
  seoTitle: "",
  seoDescription: "",
  publishedAt: new Date().toISOString(),
  author: "TOKNAV",
  status: "draft"
};

type BodyImagePosition = "cursor" | "start" | "end" | "after-paragraph";

function cleanMarkdownText(value: string) {
  return value.replace(/[\]\n\r]/g, " ").replace(/"/g, "'").trim();
}

function getParagraphInsertionIndex(text: string, paragraphNumber: number) {
  const ranges: Array<{ start: number; end: number }> = [];
  const lines = text.split(/(?<=\n)/);
  let offset = 0;
  let start: number | null = null;

  for (const line of lines) {
    if (line.trim()) {
      if (start === null) start = offset;
    } else if (start !== null) {
      ranges.push({ start, end: offset });
      start = null;
    }
    offset += line.length;
  }

  if (start !== null) ranges.push({ start, end: text.length });
  if (ranges.length === 0) return text.length;

  const safeIndex = Math.min(Math.max(paragraphNumber, 1), ranges.length) - 1;
  return ranges[safeIndex].end;
}

function insertMarkdownAt(text: string, start: number, end: number, markdown: string) {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const prefix = before.trim() ? (before.endsWith("\n\n") ? "" : "\n\n") : "";
  const suffix = after.trim() ? (after.startsWith("\n\n") ? "" : "\n\n") : "";
  const nextBody = `${before}${prefix}${markdown}${suffix}${after}`;
  const cursor = before.length + prefix.length + markdown.length + suffix.length;
  return { cursor, nextBody };
}

export default function BlogEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<CmsBlogPost>>(emptyPost);
  const [media, setMedia] = useState<CmsMediaItem[]>([]);
  const [bodyImageUrl, setBodyImageUrl] = useState("");
  const [bodyImageAlt, setBodyImageAlt] = useState("");
  const [bodyImageCaption, setBodyImageCaption] = useState("");
  const [bodyImagePosition, setBodyImagePosition] = useState<BodyImagePosition>("cursor");
  const [bodyImageParagraph, setBodyImageParagraph] = useState("1");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    fetch("/api/cms/media")
      .then((response) => response.json())
      .then((payload) => payload.ok && setMedia(payload.data))
      .catch(() => undefined);

    if (!id) return;
    fetch(`/api/cms/blog/${id}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.ok) throw new Error(payload.message || "Failed to load blog.");
        setPost(payload.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load blog."));
  }, [id]);

  function update<K extends keyof CmsBlogPost>(key: K, value: CmsBlogPost[K]) {
    setPost((current) => ({ ...current, [key]: value }));
  }

  function insertBodyImage() {
    const imageUrl = bodyImageUrl.trim();
    if (!imageUrl) {
      setError("Please choose an image before inserting it into the article body.");
      return;
    }
    setError("");
    const caption = cleanMarkdownText(bodyImageCaption);
    const alt = cleanMarkdownText(bodyImageAlt) || caption || "TOKNAV product image";
    const title = caption ? ` "${caption}"` : "";
    const imageMarkdown = `![${alt}](${imageUrl}${title})`;
    const currentBody = post.body || "";
    const textarea = bodyRef.current;
    let start = textarea?.selectionStart ?? currentBody.length;
    let end = textarea?.selectionEnd ?? currentBody.length;

    if (bodyImagePosition === "start") {
      start = 0;
      end = 0;
    } else if (bodyImagePosition === "end") {
      start = currentBody.length;
      end = currentBody.length;
    } else if (bodyImagePosition === "after-paragraph") {
      const paragraphNumber = Number.parseInt(bodyImageParagraph, 10) || 1;
      start = getParagraphInsertionIndex(currentBody, paragraphNumber);
      end = start;
    }

    const { cursor, nextBody } = insertMarkdownAt(currentBody, start, end, imageMarkdown);
    update("body", nextBody);
    window.setTimeout(() => {
      bodyRef.current?.focus();
      bodyRef.current?.setSelectionRange(cursor, cursor);
    }, 0);
  }

  async function save(status?: "draft" | "published") {
    setError("");
    setMessage("");
    const payload = { ...post, status: status || post.status || "draft" };
    const response = await fetch(isEditing ? `/api/cms/blog/${id}` : "/api/cms/blog", {
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
    setPost(result.data);
    if (!isEditing) router.replace(`/admin/blog/${result.data.id}/edit`);
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>{isEditing ? "Edit Blog Post" : "New Blog Post"}</h1>
          <p>Create SEO posts with markdown-style body content.</p>
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
            <label className="admin-field"><span>Title</span><input className="admin-input" value={post.title || ""} onChange={(event) => update("title", event.target.value)} /></label>
            <label className="admin-field"><span>Slug</span><input className="admin-input" value={post.slug || ""} onChange={(event) => update("slug", event.target.value)} /></label>
            <label className="admin-field"><span>Category</span><input className="admin-input" value={post.category || ""} onChange={(event) => update("category", event.target.value)} /></label>
            <label className="admin-field"><span>Author</span><input className="admin-input" value={post.author || ""} onChange={(event) => update("author", event.target.value)} /></label>
            <label className="admin-field"><span>Published at</span><input className="admin-input" value={post.publishedAt || ""} onChange={(event) => update("publishedAt", event.target.value)} /></label>
            <label className="admin-field"><span>Status</span><select className="admin-select" value={post.status || "draft"} onChange={(event) => update("status", event.target.value as CmsBlogPost["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          </div>
          <label className="admin-field"><span>Summary</span><textarea className="admin-textarea" value={post.summary || ""} onChange={(event) => update("summary", event.target.value)} /></label>
          <div className="admin-blog-image-tool">
            <div>
              <strong>Body image</strong>
              <small>Choose a saved image and insert it into the Body at a custom position.</small>
            </div>
            <select className="admin-select" value={bodyImageUrl} onChange={(event) => setBodyImageUrl(event.target.value)}>
              <option value="">Choose image</option>
              {media.map((item) => <option value={item.url} key={item.id}>{item.filename}</option>)}
            </select>
            <input className="admin-input" value={bodyImageAlt} onChange={(event) => setBodyImageAlt(event.target.value)} placeholder="ALT text" />
            <input className="admin-input" value={bodyImageCaption} onChange={(event) => setBodyImageCaption(event.target.value)} placeholder="Caption, optional" />
            <select className="admin-select" value={bodyImagePosition} onChange={(event) => setBodyImagePosition(event.target.value as BodyImagePosition)}>
              <option value="cursor">Current cursor position</option>
              <option value="start">Start of body</option>
              <option value="end">End of body</option>
              <option value="after-paragraph">After paragraph number</option>
            </select>
            {bodyImagePosition === "after-paragraph" ? (
              <input className="admin-input" inputMode="numeric" min="1" type="number" value={bodyImageParagraph} onChange={(event) => setBodyImageParagraph(event.target.value)} placeholder="Paragraph number" />
            ) : null}
            <button className="admin-button" type="button" onClick={insertBodyImage}>Insert into Body</button>
            {bodyImageUrl ? <img src={bodyImageUrl} alt="" /> : null}
          </div>
          <label className="admin-field"><span>Body</span><textarea ref={bodyRef} className="admin-textarea" style={{ minHeight: 360 }} value={post.body || ""} onChange={(event) => update("body", event.target.value)} /></label>
          <label className="admin-field"><span>Tags, comma separated</span><input className="admin-input" value={(post.tags || []).join(", ")} onChange={(event) => update("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
          <label className="admin-field"><span>SEO title</span><input className="admin-input" value={post.seoTitle || ""} onChange={(event) => update("seoTitle", event.target.value)} /></label>
          <label className="admin-field"><span>SEO description</span><textarea className="admin-textarea" value={post.seoDescription || ""} onChange={(event) => update("seoDescription", event.target.value)} /></label>
        </section>
        <aside className="admin-editor-panel">
          <label className="admin-field">
            <span>Cover image</span>
            <input className="admin-input" value={post.coverImage || ""} onChange={(event) => update("coverImage", event.target.value)} />
            <select className="admin-select" value={post.coverImage || ""} onChange={(event) => update("coverImage", event.target.value)}>
              <option value="">Choose media</option>
              {media.map((item) => <option value={item.url} key={item.id}>{item.filename}</option>)}
            </select>
          </label>
          {post.coverImage ? <img src={post.coverImage} alt="" style={{ width: "100%", borderRadius: 12 }} /> : null}
          {post.slug ? <a className="admin-button-secondary" href={`/blog/${post.slug}`} target="_blank">Open Preview</a> : null}
        </aside>
      </div>
    </>
  );
}
