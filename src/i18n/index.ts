import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ca from "./locales/ca.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

export const LANGS = [
  { code: "es", label: "ES", name: "Castellano" },
  { code: "ca", label: "CA", name: "Català" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

export const STORAGE_KEY = "sjg-lang";

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      es: { translation: es },
      ca: { translation: ca },
      pt: { translation: pt },
      en: { translation: en },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

/** Reads the stored/browser language. Client-only — call from useEffect. */
export function detectClientLang(): LangCode {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && LANGS.some((l) => l.code === stored)) return stored as LangCode;
  // Sem escolha guardada, o site abre sempre em castelhano.
  return "es";
}

export function setLang(code: LangCode) {
  void i18n.changeLanguage(code);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }
}

export default i18n;
