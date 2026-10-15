import { useEffect, useState } from "react";
import { readLanguage, readTheme, savePreference } from "./site-preferences";

export function useSitePreferences() {
  const [lang, setLang] = useState(readLanguage);
  const [theme, setTheme] = useState(readTheme);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.hhTheme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [lang, theme]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      setLang(readLanguage());
      setTheme(readTheme());
    };
    window.addEventListener("storage", sync);
    media.addEventListener("change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      media.removeEventListener("change", sync);
    };
  }, []);
  return {
    lang,
    dark: theme === "dark",
    toggleLanguage: () => {
      const next = lang === "zh" ? "en" : "zh";
      savePreference("pd-lang", next);
      setLang(next);
    },
    toggleTheme: () => {
      const next = theme === "dark" ? "light" : "dark";
      savePreference("hh-theme", next);
      setTheme(next);
    },
  };
}
