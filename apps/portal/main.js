import { setupSiteMenu } from "../../packages/ui/site-menu.ts";
import "../../packages/ui/icons.css";
import "../../packages/ui/site-shell.css";
import "./proof-first.css";
import { iconMarkup } from "../../packages/ui/icons.ts";
import {
  readLanguage,
  readTheme,
  savePreference,
} from "../../packages/ui/site-preferences.ts";
import { connectMarkup, setupConnect } from "./connect.js";
import { productViewer, proofContent, setupProof } from "./proof-content.js";

let lang = readLanguage();
let disposeMenu, observer;
const header = document.querySelector(".site-header");
header.classList.add("hh-site-header");
header.querySelector(".header-actions").innerHTML =
  '<button id="theme-toggle" type="button"></button><div id="lang-switch"><button type="button"></button></div>';
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#111111" : "#f7f6f3";
  document
    .querySelectorAll(".wordmark img")
    .forEach(
      (img) =>
        (img.src =
          theme === "dark"
            ? "/brand/happyhands-logo-paper.png"
            : "/brand/happyhands-logo-ink.png"),
    );
  const button = document.querySelector("#theme-toggle");
  button.innerHTML = iconMarkup(theme === "dark" ? "sun" : "moon");
  button.setAttribute(
    "aria-label",
    lang === "zh"
      ? theme === "dark"
        ? "切换到浅色模式"
        : "切换到深色模式"
      : theme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode",
  );
}
function navigationState() {
  document.querySelectorAll(".desktop-nav a").forEach((link) => {
    if (new URL(link.href).hash === location.hash && location.hash)
      link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
function render() {
  const zh = lang === "zh",
    t = (a, b) => (zh ? a : b);
  document.documentElement.lang = zh ? "zh-CN" : "en";
  document.title = t(
    "HappyHands · 产品体验优化",
    "HappyHands · Review, refine, verify",
  );
  document.querySelector(".skip-link").textContent = t(
    "跳到主要内容",
    "Skip to content",
  );
  header
    .querySelector(".wordmark")
    .setAttribute("aria-label", t("HappyHands 首页", "HappyHands home"));
  header
    .querySelector("nav")
    .setAttribute("aria-label", t("主要导航", "Main navigation"));
  header.querySelector("nav").innerHTML =
    `<a href="#screens">${t("实际效果", "Results")}</a><a href="#apps">${t("工作流程", "Workflow")}</a><a href="#explore">${t("设计资源", "Resources")}</a><a href="/apps/studio/">${t("主题工作室", "Theme Studio")}</a><a href="#connect-agent">${t("开始使用", "Get started")}</a>`;
  const languageButton = document.querySelector("#lang-switch button");
  languageButton.textContent = zh ? "EN" : "中文";
  languageButton.setAttribute("aria-label", zh ? "English" : "中文");
  disposeMenu?.();
  disposeMenu = setupSiteMenu(header, lang);
  document.querySelector("h1").innerHTML = t(
    "把页面问题，<br>改到位。",
    "Review your UI.<br>Verify the change.",
  );
  document.querySelector(".hero-copy").textContent = t(
    "从真实页面找到问题，沿用项目设计规范，确认修改后逐处复核。",
    "Find issues in real pages, work within your design system, and verify each approved change.",
  );
  document.querySelector(".hero .button-primary").textContent = t(
    "开始本地审阅",
    "Start a local review",
  );
  document.querySelector(".hero-secondary").textContent = t(
    "先看修改效果",
    "See the change",
  );
  document.querySelector("#product-viewer").innerHTML = productViewer(lang);
  document.querySelector("#portal-content").innerHTML =
    proofContent(lang) + connectMarkup(lang);
  document.querySelector("footer").innerHTML =
    `<div><a class="wordmark" href="#top"><img src="/brand/happyhands-logo-ink.png" alt="HappyHands" width="200" height="44"></a><p>${t("让每次修改，都有据可查。", "A clear record of every change.")}</p></div><div class="footer-links"><a href="https://github.com/ShuaiMXu/creative-os">${t("开源项目", "Core repository")}</a><a href="https://github.com/ShuaiMXu/creative-os-site">${t("网站源码", "Website source")}</a><a href="/apps/studio/">${t("主题工作室", "Theme Studio")}</a></div>`;
  setupConnect(lang);
  setupProof(lang);
  navigationState();
  applyTheme(readTheme());
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("arrived");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".case-copy > *, .case-evidence, .section-heading > *, .workflow li, .foundation-lead > *, .foundation-sources, .resource-links, .section-connect .section-head > *",
    )
    .forEach((el) => observer.observe(el));
}
header.querySelector("#theme-toggle").addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  savePreference("hh-theme", next);
  applyTheme(next);
});
header.querySelector("#lang-switch button").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  savePreference("pd-lang", lang);
  render();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () =>
  applyTheme(readTheme()),
);
window.addEventListener("storage", (event) => {
  if (event.key === "hh-theme" || event.key === null) applyTheme(readTheme());
  if (event.key === "pd-lang" || event.key === null) {
    lang = readLanguage();
    render();
  }
});
window.addEventListener("hashchange", navigationState);
// -- copy to clipboard --
let toastTimer;
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent = lang === "zh" ? "已复制" : "Copied";
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
    }
  } catch {
    const toast = document.querySelector("#toast");
    if (toast) {
      toast.textContent =
        lang === "zh"
          ? "无法复制，请手动选择上方命令。"
          : "Copy unavailable. Select the command above manually.";
      toast.classList.add("show");
    }
  }
});

render();
// Preserve old inbound anchors after consolidating the start flow.
if (location.hash === "#get-started") location.replace("#connect-agent");
