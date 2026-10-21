import { iconMarkup } from "./icons";

// Both the plain-JS portal and React pages use the same disclosure behavior.
export function setupSiteMenu(header: HTMLElement, lang: string) {
  const button = header.querySelector<HTMLButtonElement>(
    ".hh-site-menu-toggle",
  )!;
  const nav = header.querySelector<HTMLElement>("nav")!;
  const narrow = window.matchMedia("(max-width: 1000px)");
  let open = false;
  function close(restoreFocus = false) {
    open = false;
    header.removeAttribute("data-menu-open");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = iconMarkup("menu");
    if (restoreFocus) button.focus();
  }
  function toggle() {
    if (open) close();
    else if (narrow.matches) {
      open = true;
      header.setAttribute("data-menu-open", "");
      button.setAttribute("aria-expanded", "true");
      button.innerHTML = iconMarkup("close");
    }
  }
  function onKey(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close(true);
    }
  }
  function onOutside(event: PointerEvent) {
    if (
      open &&
      event.target instanceof Node &&
      !header.contains(event.target)
    ) {
      close(nav.contains(document.activeElement));
    }
  }
  function onLink(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest("a")) close();
  }
  function onResize() {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnButton = document.activeElement === button;
    close(narrow.matches && focusInNav);
    if (!narrow.matches && focusOnButton)
      nav.querySelector<HTMLAnchorElement>("a")?.focus();
  }
  button.setAttribute("aria-label", lang === "zh" ? "菜单" : "Menu");
  close();
  header.setAttribute("data-menu-ready", "");
  button.addEventListener("click", toggle);
  header.addEventListener("keydown", onKey);
  nav.addEventListener("click", onLink);
  document.addEventListener("pointerdown", onOutside);
  narrow.addEventListener("change", onResize);
  return () => {
    button.removeEventListener("click", toggle);
    header.removeEventListener("keydown", onKey);
    nav.removeEventListener("click", onLink);
    document.removeEventListener("pointerdown", onOutside);
    narrow.removeEventListener("change", onResize);
    close();
    header.removeAttribute("data-menu-ready");
  };
}
