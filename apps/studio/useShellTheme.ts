import { useEffect, useState } from "react";
type Theme = "light" | "dark";
export function useShellTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("hh-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.hhTheme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      try {
        const saved = localStorage.getItem("hh-theme");
        setTheme(
          saved === "light" || saved === "dark"
            ? saved
            : media.matches
              ? "dark"
              : "light",
        );
      } catch {
        setTheme(media.matches ? "dark" : "light");
      }
    };
    const storage = (event: StorageEvent) => {
      if (event.key === "hh-theme" || event.key === null) sync();
    };
    media.addEventListener("change", sync);
    window.addEventListener("storage", storage);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", storage);
    };
  }, []);
  return {
    theme,
    toggle: () => {
      const next = theme === "light" ? "dark" : "light";
      setTheme(next);
      try {
        localStorage.setItem("hh-theme", next);
      } catch {
        /* Current session still works. */
      }
    },
  };
}
