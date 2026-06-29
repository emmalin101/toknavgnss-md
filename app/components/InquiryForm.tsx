"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { useI18n } from "./I18nProvider";

type InquiryFormValues = {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  country: string;
  product: string;
  message: string;
  website: string;
};

type FormErrors = Partial<Record<keyof InquiryFormValues, string>>;

const initialValues: InquiryFormValues = {
  name: "",
  email: "",
  whatsapp: "",
  company: "",
  country: "",
  product: "",
  message: "",
  website: ""
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[0-9 ()-]{7,22}$/;
const productOptions = [
  "GNSS Receiver",
  "Rugged & GIS",
  "GNSS Antenna",
  "Precision Agriculture",
  "Machine Control",
  "CORS / VRS Solution",
  "Software",
  "Dealer Cooperation"
];

function validate(values: InquiryFormValues, t: (key: string) => string) {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = t("form.error.nameRequired");
  }

  if (!values.email.trim()) {
    errors.email = t("form.error.emailRequired");
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = t("form.error.emailInvalid");
  }

  if (!values.whatsapp.trim()) {
    errors.whatsapp = t("form.error.whatsappRequired");
  } else if (!whatsappPattern.test(values.whatsapp.trim())) {
    errors.whatsapp = t("form.error.whatsappInvalid");
  }

  return errors;
}

export default function InquiryForm() {
  const { t } = useI18n();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const selectOptions = values.product && !productOptions.includes(values.product)
    ? [values.product, ...productOptions]
    : productOptions;

  const hasRequiredInput = useMemo(
    () => values.name.trim() && values.email.trim() && values.whatsapp.trim(),
    [values.email, values.name, values.whatsapp]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    const message = params.get("message");

    if (product || message) {
      setValues((current) => ({
        ...current,
        product: product ?? current.product,
        message: message ?? current.message
      }));
    }
  }, []);

  function updateValue(field: keyof InquiryFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values, t);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage(t("form.status.required"));
      return;
    }

    setStatus("submitting");
    setStatusMessage(t("form.status.submitting"));

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Submission failed.");
      setStatus("success");
      setStatusMessage(payload.message || "Inquiry submitted successfully.");
      setValues(initialValues);
    } catch (err) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  }

  return (
    <form
      className="b2b-inquiry-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        aria-hidden="true"
        autoComplete="off"
        className="honeypot"
        name="website"
        tabIndex={-1}
        value={values.website}
        onChange={(event) => updateValue("website", event.target.value)}
      />

      <div className="form-row two-cols">
        <label>
          <span>
            <span data-i18n="form.name">{t("form.name")}</span> <b>*</b>
          </span>
          <input
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            name="name"
            placeholder={t("form.placeholder.name")}
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
          />
          {errors.name && <small>{errors.name}</small>}
        </label>

        <label>
          <span>
            <span data-i18n="form.email">{t("form.email")}</span> <b>*</b>
          </span>
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            inputMode="email"
            name="email"
            placeholder={t("form.placeholder.email")}
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
          />
          {errors.email && <small>{errors.email}</small>}
        </label>
      </div>

      <div className="form-row two-cols">
        <label>
          <span>
            <span data-i18n="form.whatsapp">{t("form.whatsapp")}</span> <b>*</b>
          </span>
          <input
            aria-invalid={Boolean(errors.whatsapp)}
            autoComplete="tel"
            inputMode="tel"
            name="whatsapp"
            placeholder={t("form.placeholder.whatsapp")}
            value={values.whatsapp}
            onChange={(event) => updateValue("whatsapp", event.target.value)}
          />
          {errors.whatsapp && <small>{errors.whatsapp}</small>}
        </label>

        <label>
          <span data-i18n="form.company">{t("form.company")}</span>
          <input
            autoComplete="organization"
            name="company"
            placeholder={t("form.placeholder.company")}
            value={values.company}
            onChange={(event) => updateValue("company", event.target.value)}
          />
        </label>
      </div>

      <div className="form-row two-cols">
        <label>
          <span data-i18n="form.country">{t("form.country")}</span>
          <input
            autoComplete="country-name"
            name="country"
            placeholder={t("form.placeholder.country")}
            value={values.country}
            onChange={(event) => updateValue("country", event.target.value)}
          />
        </label>

        <label>
          <span data-i18n="form.product">{t("form.product")}</span>
          <select
            name="product"
            value={values.product}
            onChange={(event) => updateValue("product", event.target.value)}
          >
            <option value="">{t("form.placeholder.product")}</option>
            {selectOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span data-i18n="form.message">{t("form.message")}</span>
        <textarea
          name="message"
          placeholder={t("form.placeholder.message")}
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
        />
      </label>

      <div className="form-submit-row">
        <button disabled={status === "submitting"} type="submit">
          {status === "submitting" ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
          {status === "submitting" ? t("form.status.submittingShort") : t("form.submit")}
        </button>
        <span className="required-note">{t("form.requiredNote")}</span>
      </div>

      {statusMessage && (
        <div className={`form-status ${status}`} role="status">
          {status === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span>{statusMessage}</span>
        </div>
      )}

      {!hasRequiredInput && status === "idle" && (
        <div className="spam-note">
          <ShieldCheck size={18} />
          <span>{t("form.spamNote")}</span>
        </div>
      )}
    </form>
  );
}
