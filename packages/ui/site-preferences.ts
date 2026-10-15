export type SiteLanguage = "zh" | "en";
let sessionLanguage: SiteLanguage = "zh";
let sessionTheme: "light" | "dark" | undefined;

export function readLanguage(): SiteLanguage {
  try {
    return localStorage.getItem("pd-lang") === "en" ? "en" : "zh";
  } catch {
    return sessionLanguage;
  }
}

export function readTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("hh-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    if (sessionTheme) return sessionTheme;
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function savePreference(key: "pd-lang" | "hh-theme", value: string) {
  if (key === "pd-lang") sessionLanguage = value === "en" ? "en" : "zh";
  if (key === "hh-theme") sessionTheme = value === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Session remains usable. */
  }
}
