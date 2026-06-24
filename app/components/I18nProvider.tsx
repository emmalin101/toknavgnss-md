"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";
import {
  DEFAULT_LANGUAGE,
  getLanguageMeta,
  LanguageCode,
  messages,
  normalizeLanguageCode,
  STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  translate
} from "../lib/i18n";

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: string) => void;
  languages: typeof SUPPORTED_LANGUAGES;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readSavedLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    return normalizeLanguageCode(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function applyDomTranslations(language: LanguageCode) {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    element.textContent = translate(language, key);
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (!key) return;
    element.setAttribute("placeholder", translate(language, key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((element) => {
    const key = element.dataset.i18nTitle;
    if (!key) return;
    element.setAttribute("title", translate(language, key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (!key) return;
    element.setAttribute("aria-label", translate(language, key));
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setLanguageState(readSavedLanguage());
  }, []);

  useEffect(() => {
    const meta = getLanguageMeta(language);
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir;
    document.documentElement.dataset.locale = meta.code;
    applyDomTranslations(language);

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The page still updates when storage is unavailable.
    }
  }, [language]);

  const setLanguage = useCallback((nextLanguage: string) => {
    setLanguageState(normalizeLanguageCode(nextLanguage));
  }, []);

  const t = useCallback(
    (key: string) => {
      if (!messages[language]?.[key] && process.env.NODE_ENV !== "production") {
        console.warn(`Missing i18n key: ${key}`);
      }
      return translate(language, key);
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, languages: SUPPORTED_LANGUAGES, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }
  return context;
}
