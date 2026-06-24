"use client";

import { Globe2 } from "lucide-react";
import { useId } from "react";
import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher() {
  const id = useId();
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <div className="language-switcher">
      <Globe2 aria-hidden="true" size={17} />
      <label className="language-switcher-label" htmlFor={id}>
        {t("language.label")}
      </label>
      <select
        aria-label={t("language.selectAriaLabel")}
        className="language-switcher-select"
        id={id}
        onChange={(event) => setLanguage(event.target.value)}
        value={language}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
