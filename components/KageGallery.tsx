import "./kage-detail.css";
import React, { useEffect, useRef, useState } from "react";
import { KageDetail, KageImage, type KageDesign as Design } from "./KageDetail";
import { Button } from "../packages/ui";
export function KageGallery({ lang }: { lang: string }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [query, setQuery] = useState(""),
    [activeQuery, setActiveQuery] = useState(""),
    [items, setItems] = useState<Design[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [searched, setSearched] = useState(false),
    [selected, setSelected] = useState<Design | null>(null);
  const [detailBusy, setDetailBusy] = useState(false),
    [detailError, setDetailError] = useState("");
  const controller = useRef<AbortController | null>(null),
    detailController = useRef<AbortController | null>(null),
    opener = useRef<HTMLButtonElement | null>(null);
  useEffect(
    () => () => {
      controller.current?.abort();
      detailController.current?.abort();
    },
    [],
  );
  useEffect(() => {
    const timer = window.setTimeout(() => void search(undefined, ""), 0);
    return () => window.clearTimeout(timer);
  }, []);
  async function search(e?: React.FormEvent, phrase = query) {
    e?.preventDefault();
    setActiveQuery(phrase.trim());
    setQuery(phrase);
    controller.current?.abort();
    detailController.current?.abort();
    const c = new AbortController();
    controller.current = c;
    setBusy(true);
    setError("");
    setSelected(null);
    setItems([]);
    setSearched(true);
    try {
      const r = await fetch(
        phrase.trim()
          ? `/api/kage?query=${encodeURIComponent(phrase.trim())}`
          : "/api/kage?browse=all",
        { signal: c.signal },
      );
      if (!r.ok) throw Error();
      const data = await r.json();
      if (!c.signal.aborted) setItems(data.designs);
    } catch {
      if (!c.signal.aborted)
        setError(
          t(
            "暂时无法获取参考，请重试。",
            "Unable to load references. Please retry.",
          ),
        );
    } finally {
      if (!c.signal.aborted) setBusy(false);
    }
  }
  async function open(x: Design) {
    detailController.current?.abort();
    const c = new AbortController();
    detailController.current = c;
    setSelected(x);
    setDetailBusy(true);
    setDetailError("");
    try {
      const r = await fetch(`/api/kage?slug=${encodeURIComponent(x.slug)}`, {
        signal: c.signal,
      });
      if (!r.ok) throw Error();
      const data = await r.json();
      if (!c.signal.aborted) setSelected(data.design);
    } catch {
      if (!c.signal.aborted)
        setDetailError(
          t("详情加载失败，请重试。", "Unable to load details. Please retry."),
        );
    } finally {
      if (!c.signal.aborted) setDetailBusy(false);
    }
  }
  return (
    <section className="kage-gallery">
      <p>
        {t(
          "搜索产品或风格，在本站查看截图、设计分析和页面区块。",
          "Search a product or style, then explore screenshots, analysis and page sections here.",
        )}
      </p>
      <form onSubmit={search} className="kage-search">
        <label>
          {t("产品或风格", "Product or style")}
          <input
            type="search"
            maxLength={160}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Linear, minimal, dashboard…"
          />
        </label>
        <Button type="submit" variant="primary" loading={busy}>
          {busy
            ? t("查询中…", "Searching…")
            : t("查找参考", "Search references")}
        </Button>
      </form>
      <div
        className="kage-suggestions"
        role="group"
        aria-label={t("参考方向", "Reference topics")}
      >
        {[
          [t("全部类型", "All types"), ""],
          [t("产品首页", "Landing pages"), "landing page"],
          ["Linear", "Linear"],
          [t("仪表盘", "Dashboard"), "dashboard"],
          [t("极简页面", "Minimal pages"), "minimal"],
          [t("定价页面", "Pricing pages"), "pricing"],
          [t("作品集", "Portfolios"), "portfolio"],
          [t("电商", "Commerce"), "ecommerce"],
          [t("金融产品", "Finance"), "finance"],
          [t("AI 产品", "AI products"), "AI"],
          [t("编辑排版", "Editorial"), "editorial"],
          [t("深色界面", "Dark interfaces"), "dark"],
          [t("字体设计", "Typography"), "typography"],
        ].map(([label, phrase]) => (
          <Button
            key={phrase}
            aria-pressed={activeQuery === phrase}
            onClick={() => void search(undefined, phrase)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p role="status">
        {error ||
          (!busy && searched && !items.length
            ? t("没有找到匹配的参考。", "No matching references.")
            : !busy && items.length
              ? t(
                  `共 ${items.length} 个参考，点击卡片查看完整页面与设计分析。`,
                  `${items.length} references. Open a card for the full page and design analysis.`,
                )
              : "")}
      </p>
      {!busy && !error && items.length > 0 && (
        <p className="kage-result-note">
          {t(
            "每次最多展示 24 个结果，可切换分类或搜索其他参考。",
            "Up to 24 results per request. Choose a topic or search for other references.",
          )}
        </p>
      )}
      {!searched && (
        <p className="kage-empty">
          {t(
            "选择一个参考方向，或输入你想查看的产品。",
            "Choose a topic or enter a product you want to explore.",
          )}
        </p>
      )}
      {error && (
        <Button onClick={() => void search(undefined, activeQuery)}>
          {t("重新加载参考", "Retry references")}
        </Button>
      )}
      {busy && <p role="status">{t("正在查找参考…", "Finding references…")}</p>}
      <div className="kage-grid" aria-busy={busy} hidden={!!selected}>
        {items.map((x) => (
          <button
            className="kage-card"
            key={x.slug}
            onClick={(e) => {
              opener.current = e.currentTarget;
              void open(x);
            }}
          >
            <KageImage src={x.image} title={x.title} lang={lang} />
            <strong>{x.title}</strong>
            <span>{[x.product, ...x.styles].filter(Boolean).join(" / ")}</span>
            <span>{t("站内查看", "Explore here")}</span>
          </button>
        ))}
      </div>
      {selected && (
        <KageDetail
          key={selected.slug}
          design={selected}
          lang={lang}
          busy={detailBusy}
          error={detailError}
          retry={() => void open(selected)}
          close={() => {
            detailController.current?.abort();
            setSelected(null);
            requestAnimationFrame(() => opener.current?.focus());
          }}
        />
      )}
    </section>
  );
}
