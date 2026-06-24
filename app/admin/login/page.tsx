"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLanguageSwitcher from "../components/AdminLanguageSwitcher";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("emma@toknav.cn");
  const [password, setPassword] = useState("");
  const [hasAdmin, setHasAdmin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cms/auth/login")
      .then((response) => response.json())
      .then((payload) => setHasAdmin(Boolean(payload.hasAdmin)))
      .catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Login failed.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-body admin-login-page">
      <form className="admin-login-card admin-form" onSubmit={submit}>
        <div className="admin-login-language">
          <AdminLanguageSwitcher />
        </div>
        <img src="/assets/toknav-logo-blue.png" alt="TOKNAV" />
        <div>
          <h1>{hasAdmin ? "Admin Login" : "Initialize Admin"}</h1>
          <p>{hasAdmin ? "Manage website content, SEO, products and media." : "No admin exists yet. This first login will create the administrator account."}</p>
        </div>
        {message ? <div className="admin-error">{message}</div> : null}
        <label className="admin-field">
          <span>Email</span>
          <input className="admin-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            className="admin-input"
            minLength={10}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 10 characters"
            required
          />
        </label>
        <button className="admin-button" disabled={loading} type="submit">
          {loading ? "Please wait..." : hasAdmin ? "Login" : "Create Admin"}
        </button>
      </form>
    </main>
  );
}
