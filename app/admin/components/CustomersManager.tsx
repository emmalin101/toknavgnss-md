"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsCustomer, CmsCustomerStatus } from "../../lib/cms/types";

const statusOptions: CmsCustomerStatus[] = ["lead", "active", "repeat", "inactive"];

const emptyCustomer: Partial<CmsCustomer> = {
  name: "",
  email: "",
  whatsapp: "",
  company: "",
  country: "",
  products: [],
  source: "manual",
  status: "lead",
  notes: ""
};

async function loadCustomers() {
  const response = await fetch("/api/cms/customers", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || "Failed to load customers.");
  return payload.data as CmsCustomer[];
}

function linesToArray(text: string) {
  return text.split("\n").map((item) => item.trim()).filter(Boolean);
}

export default function CustomersManager() {
  const [customers, setCustomers] = useState<CmsCustomer[]>([]);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [draft, setDraft] = useState<Partial<CmsCustomer>>(emptyCustomer);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setError("");
    try {
      setCustomers(await loadCustomers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredCustomers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.whatsapp, customer.company, customer.country, customer.products.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [customers, query]);

  function selectCustomer(customer: CmsCustomer) {
    setSelectedId(customer.id);
    setDraft(customer);
    setMessage("");
    setError("");
  }

  function startNew() {
    setSelectedId("new");
    setDraft(emptyCustomer);
    setMessage("");
    setError("");
  }

  function update<K extends keyof CmsCustomer>(key: K, value: CmsCustomer[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setError("");
    setMessage("");
    const isNew = selectedId === "new";
    const response = await fetch(isNew ? "/api/cms/customers" : `/api/cms/customers/${selectedId}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Save failed.");
      return;
    }
    if (isNew) {
      setCustomers((current) => [payload.data, ...current]);
      setSelectedId(payload.data.id);
    } else {
      setCustomers((current) => current.map((customer) => (customer.id === selectedId ? payload.data : customer)));
    }
    setDraft(payload.data);
    setMessage("Customer saved.");
  }

  async function remove() {
    if (selectedId === "new") return;
    if (!confirm("Delete this customer record? Related inquiries will remain, but the customer link will be cleared.")) return;
    const response = await fetch(`/api/cms/customers/${selectedId}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setError(payload.message || "Delete failed.");
      return;
    }
    setCustomers((current) => current.filter((customer) => customer.id !== selectedId));
    startNew();
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-page-title">
          <h1>Customers</h1>
          <p>Manage website leads, old customers, notes, product interests and contact records in one place.</p>
        </div>
        <button className="admin-button" type="button" onClick={startNew}>New Customer</button>
      </div>
      {error ? <div className="admin-error">{error}</div> : null}
      {message ? <div className="admin-success">{message}</div> : null}
      <div className="admin-editor admin-crm-layout">
        <section className="admin-editor-panel">
          <label className="admin-field">
            <span>Search customers</span>
            <input className="admin-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, company, email, country or product" />
          </label>
          <div className="admin-customer-list">
            {filteredCustomers.map((customer) => (
              <button
                className={`admin-customer-row ${selectedId === customer.id ? "active" : ""}`}
                key={customer.id}
                type="button"
                onClick={() => selectCustomer(customer)}
              >
                <strong>{customer.company || customer.name}</strong>
                <span>{customer.name} · {customer.status}</span>
                <small>{customer.email || customer.whatsapp || "No contact saved"}</small>
              </button>
            ))}
            {!filteredCustomers.length ? <div className="admin-card">No customers found.</div> : null}
          </div>
        </section>
        <section className="admin-editor-panel">
          <div className="admin-field-grid">
            <label className="admin-field"><span>Name</span><input className="admin-input" value={draft.name || ""} onChange={(event) => update("name", event.target.value)} /></label>
            <label className="admin-field"><span>Company</span><input className="admin-input" value={draft.company || ""} onChange={(event) => update("company", event.target.value)} /></label>
            <label className="admin-field"><span>Email</span><input className="admin-input" value={draft.email || ""} onChange={(event) => update("email", event.target.value)} /></label>
            <label className="admin-field"><span>WhatsApp</span><input className="admin-input" value={draft.whatsapp || ""} onChange={(event) => update("whatsapp", event.target.value)} /></label>
            <label className="admin-field"><span>Country / Region</span><input className="admin-input" value={draft.country || ""} onChange={(event) => update("country", event.target.value)} /></label>
            <label className="admin-field"><span>Status</span><select className="admin-select" value={draft.status || "lead"} onChange={(event) => update("status", event.target.value as CmsCustomerStatus)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
          </div>
          <label className="admin-field">
            <span>Product interests, one per line</span>
            <textarea className="admin-textarea" value={(draft.products || []).join("\n")} onChange={(event) => update("products", linesToArray(event.target.value))} />
          </label>
          <label className="admin-field">
            <span>Notes</span>
            <textarea className="admin-textarea" style={{ minHeight: 220 }} value={draft.notes || ""} onChange={(event) => update("notes", event.target.value)} placeholder="Record buyer background, quote history, preferred products, shipment notes or next follow-up." />
          </label>
          <div className="admin-actions">
            <button className="admin-button" type="button" onClick={save}>Save Customer</button>
            {selectedId !== "new" ? <button className="admin-danger-button" type="button" onClick={remove}>Delete</button> : null}
          </div>
        </section>
      </div>
    </>
  );
}
