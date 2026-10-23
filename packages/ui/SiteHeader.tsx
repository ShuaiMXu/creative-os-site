import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import React, { useEffect, useRef } from "react";
import { setupSiteMenu } from "./site-menu";
import { siteNavigation } from "./site-navigation";
import "./site-shell.css";
export function SiteHeader({
  lang,
  dark,
  onLanguage,
  onTheme,
  active = "/apps/portal/#explore",
}: {
  lang: string;
  dark: boolean;
  onLanguage: () => void;
  onTheme: () => void;
  active?: string;
}) {
  const header = useRef<HTMLElement>(null);
  useEffect(() => setupSiteMenu(header.current!, lang), [lang]);
  return (
    <header className="hh-site-header" ref={header}>
      <a href="/apps/portal/" aria-label="HappyHands">
        <img
          src={
            dark
              ? "/brand/happyhands-logo-paper.png"
              : "/brand/happyhands-logo-ink.png"
          }
          alt="HappyHands"
        />
      </a>
      <button
        className="hh-site-menu-toggle"
        type="button"
        aria-controls="site-navigation"
        aria-expanded="false"
        aria-label={lang === "zh" ? "菜单" : "Menu"}
      >
        <Icon name="menu" />
      </button>
      <nav
        id="site-navigation"
        aria-label={lang === "zh" ? "主要导航" : "Main navigation"}
      >
        {siteNavigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.href === (active === "/apps/portal/#explore" ? "/components/?provider=systems" : active) ? "page" : undefined}
          >
            {lang === "zh" ? item.zh : item.en}
          </a>
        ))}
      </nav>
      <div className="hh-site-tools">
        <Tooltip label={lang === "zh" ? `切换到${dark ? "浅色" : "深色"}模式` : `Switch to ${dark ? "light" : "dark"} mode`}>
        <button
          onClick={onTheme}
          type="button"
          aria-label={
            lang === "zh"
              ? `切换到${dark ? "浅色" : "深色"}模式`
              : `Switch to ${dark ? "light" : "dark"} mode`
          }
        >
          <Icon name={dark ? "sun" : "moon"} />
          <span className="hh-tool-label">
            {dark
              ? lang === "zh"
                ? "浅色"
                : "Light"
              : lang === "zh"
                ? "深色"
                : "Dark"}
          </span>
        </button>
        </Tooltip>
        <Tooltip label={lang === "zh" ? "Switch to English" : "切换到中文"}>
        <button
          onClick={onLanguage}
          type="button"
          aria-label={lang === "zh" ? "English" : "中文"}
        >
          <Icon name="globe" />
          <span className="hh-tool-label">
            {lang === "zh" ? "English" : "中文"}
          </span>
        </button>
        </Tooltip>
      </div>
    </header>
  );
}
