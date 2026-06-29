"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsCustomer, CmsInquiry, CmsInquiryStatus } from "../../lib/cms/types";

const statusOptions: CmsInquiryStatus[] = ["new", "contacted", "quoted", "won", "lost", "archived"];

async function loadResource<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || "Failed to load data.");
  return payload.data as T;
}

function whatsappUrl(value: string) {
  const number = value.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return number ? `https://wa.me/${number}` : "";
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<CmsInquiry[]>([]);
  const [customers, setCustomers] = useState<CmsCustomer[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<CmsInquiry>>>({});
  const [filter, setFilter] = useState<"all" | CmsInquiryStatus>("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setError("");
    try {
      const [nextInquiries, nextCustomers] = await Promise.all([
        loadResource<CmsInquiry[]>("/api/cms/inquiries"),
        loadResource<CmsCustomer[]>("/api/cms/customers")
      ]);
      setInquiries(nextInquiries);
      setCustomers(nextCustomers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const customersById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer]));
  }, [customers]);

  const visibleInquiries = filter === "all" ? inquiries : inquiries.filter((item) => item.status === filter);

  function updateDraft(id: string, patch: Partial<CmsInquiry>) {
    setEditing((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  async function saveInquiry(inquiry: CmsInquiry) {
    setError("");
    setMessage("");
    const draft = editing[inquiry.id] || {};
    const response = await fetch(`/api/cms/inquiries/${inquiry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...inquiry, ...draft })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Save failed.");
      return;
    }
    setInquiries((current) => current.map((item) => (item.id === inquiry.id ? payload.data : item)));
    setEditing((current) => {
      const next = { ...current };
      delete next[inquiry.id];
      return next;
    });
    setMessage("Inquiry updated.");
  }

  async function removeInquiry(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    const response = await fetch(`/api/cms/inquiries/${id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Delete failed.");
      return;
    }
    setInquiries((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>Inquiries</h1>
          <p>Website inquiries are saved here first, then matched to customer records by email or WhatsApp.</p>
        </div>
        <select className="admin-select compact" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="all">All statuses</option>
          {statusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {message ? <div className="admin-success">{message}</div> : null}
      <div className="admin-list">
        {visibleInquiries.map((inquiry) => {
          const draft = editing[inquiry.id] || {};
          const customer = customersById.get(inquiry.customerId);
          const wa = whatsappUrl(inquiry.whatsapp);
          return (
            <article className="admin-list-card admin-inquiry-card" key={inquiry.id}>
              <div className="admin-inquiry-main">
                <div>
                  <h2>{inquiry.name}</h2>
                  <span className="admin-pill">{draft.status || inquiry.status}</span>
                  <span className="admin-muted">{new Date(inquiry.createdAt).toLocaleString()}</span>
                </div>
                <div className="admin-contact-line">
                  <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                  {wa ? <a href={wa} target="_blank">WhatsApp</a> : null}
                  {customer ? <span>{customer.company || customer.name}</span> : null}
                </div>
                <p>{inquiry.message || "No message provided."}</p>
                <div className="admin-field-grid">
                  <label className="admin-field">
                    <span>Status</span>
                    <select
                      className="admin-select"
                      value={draft.status || inquiry.status}
                      onChange={(event) => updateDraft(inquiry.id, { status: event.target.value as CmsInquiryStatus })}
                    >
                      {statusOptions.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>Product interest</span>
                    <input
                      className="admin-input"
                      value={draft.product ?? inquiry.product}
                      onChange={(event) => updateDraft(inquiry.id, { product: event.target.value })}
                    />
                  </label>
                </div>
                <label className="admin-field">
                  <span>Follow-up notes</span>
                  <textarea
                    className="admin-textarea"
                    value={draft.notes ?? inquiry.notes}
                    onChange={(event) => updateDraft(inquiry.id, { notes: event.target.value })}
                    placeholder="Record quotation, follow-up result, buyer requirements or next action."
                  />
                </label>
              </div>
              <div className="admin-actions">
                <button className="admin-button-secondary" type="button" onClick={() => saveInquiry(inquiry)}>Save</button>
                <button className="admin-danger-button" type="button" onClick={() => removeInquiry(inquiry.id)}>Delete</button>
              </div>
            </article>
          );
        })}
        {!visibleInquiries.length ? <div className="admin-card">No inquiries yet.</div> : null}
      </div>
    </>
  );
}
