import { Icon } from "./Icon";
import React from "react";
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
  return (
    <header className="hh-site-header">
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
      <nav aria-label={lang === "zh" ? "主要导航" : "Main navigation"}>
        {siteNavigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={item.href === active ? "page" : undefined}
          >
            {lang === "zh" ? item.zh : item.en}
          </a>
        ))}
      </nav>
      <div className="hh-site-tools">
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
          {dark
            ? lang === "zh"
              ? "浅色"
              : "Light"
            : lang === "zh"
              ? "深色"
              : "Dark"}
        </button>
        <button onClick={onLanguage} type="button">
          <Icon name="globe" />
          {lang === "zh" ? "English" : "中文"}
        </button>
      </div>
    </header>
  );
}
