import { useEffect, useRef, useState } from "react";
import { Button } from "../packages/ui";
import { ReferenceActions } from "./ReferenceActions";

export type KageComponent = {
  slug: string;
  title: string;
  description: string;
  kind: string;
  image: string | null;
  source: string | null;
  prompt: string;
};
export type KageDesign = {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  fullImage: string | null;
  fullPageImage?: string | null;
  source: string | null;
  website?: string | null;
  product: string;
  styles: string[];
  prompt?: string;
  components?: KageComponent[];
};
export function KageImage({
  src,
  title,
  lang,
}: {
  src?: string | null;
  title: string;
  lang: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? (
    <img
      src={src}
      alt={title}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="kage-image-fallback">
      {lang === "zh" ? "参考图暂不可用" : "Reference image unavailable"}
    </span>
  );
}
export function KageDetail({
  design,
  lang,
  busy,
  error,
  retry,
  close,
}: {
  design: KageDesign;
  lang: string;
  busy: boolean;
  error: string;
  retry: () => void;
  close: () => void;
}) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [view, setView] = useState("page");
  const [fullPage, setFullPage] = useState(false);
  const [componentSlug, setComponentSlug] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const components = design.components || [];
  const component =
    components.find((x) => x.slug === componentSlug) || components[0];
  const image =
    view === "components"
      ? component?.image
      : fullPage
        ? design.fullPageImage
        : design.fullImage || design.image;
  const imageTitle =
    view === "components" ? component?.title || design.title : design.title;
  const analysis = view === "components" ? component?.prompt : design.prompt;
  const source =
    view === "components" ? component?.source || design.source : design.source;
  return (
    <section
      className="kage-detail"
      aria-label={t("设计详情", "Design details")}
      aria-busy={busy}
    >
      <div className="kage-detail-heading">
        <div>
          <p className="catalog-eyebrow">{design.product || "Kage"}</p>
          <h3 ref={heading} tabIndex={-1}>
            {design.title}
          </h3>
        </div>
        <Button onClick={close}>{t("收起详情", "Close details")}</Button>
      </div>
      <p>{design.description}</p>
      <div
        className="kage-view-options"
        role="group"
        aria-label={t("查看内容", "View content")}
      >
        {[
          ["page", t("页面效果", "Page preview")],
          ["analysis", t("设计分析", "Design analysis")],
          [
            "components",
            `${t("页面区块", "Page sections")}${busy ? "" : ` / ${components.length}`}`,
          ],
        ].map(([id, label]) => (
          <Button
            key={id}
            aria-pressed={view === id}
            variant={view === id ? "primary" : "secondary"}
            onClick={() => setView(id)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p role="status">
        {busy ? t("正在加载设计分析…", "Loading analysis…") : error}
      </p>
      {error && <Button onClick={retry}>{t("重试", "Retry")}</Button>}
      {view === "page" && (
        <>
          <div className="kage-image-tools">
            {design.fullPageImage && (
              <Button
                onClick={() => setFullPage(!fullPage)}
                aria-pressed={fullPage}
              >
                {fullPage
                  ? t("查看首屏", "Show first screen")
                  : t("查看整页", "Show full page")}
              </Button>
            )}
            {image && (
              <Button onClick={() => dialog.current?.showModal()}>
                {t("放大查看", "Enlarge image")}
              </Button>
            )}
          </div>
          <div className={`kage-page-image ${fullPage ? "is-full-page" : ""}`}>
            <KageImage src={image} title={imageTitle} lang={lang} />
          </div>
        </>
      )}
      {view === "components" &&
        !busy &&
        !error &&
        (components.length ? (
          <div className="kage-sections-layout">
            <div
              className="kage-section-list"
              role="group"
              aria-label={t("选择页面区块", "Choose page section")}
            >
              {components.map((x) => (
                <Button
                  key={x.slug}
                  className="kage-section-option"
                  aria-pressed={x.slug === component?.slug}
                  onClick={() => setComponentSlug(x.slug)}
                >
                  <span>{x.kind}</span>
                  <strong>{x.title}</strong>
                </Button>
              ))}
            </div>
            <div className="kage-section-content">
              <h4>{component?.title}</h4>
              <p>{component?.description}</p>
              {image && (
                <Button onClick={() => dialog.current?.showModal()}>
                  {t("放大查看", "Enlarge image")}
                </Button>
              )}
              <div className="kage-page-image">
                <KageImage src={image} title={imageTitle} lang={lang} />
              </div>
              {analysis && (
                <details className="kage-section-analysis">
                  <summary>
                    {t("区块分析 / 原文", "Section analysis / Original")}
                  </summary>
                  <pre className="reference-text">{analysis}</pre>
                </details>
              )}
              {analysis && (
                <ReferenceActions
                  key={component?.slug}
                  lang={lang}
                  content={analysis}
                  source={source || imageTitle}
                />
              )}
              {source && (
                <a href={source} target="_blank" rel="noreferrer">
                  {t("区块来源", "Section source")}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p>
            {t(
              "这个参考暂未提供区块拆解，可以查看页面效果与设计分析。",
              "No section breakdown is available. View the page preview or design analysis.",
            )}
          </p>
        ))}
      {view === "analysis" && !busy && !error && (
        <>
          <h4>{t("设计分析 / 原文", "Design analysis / Original")}</h4>
          {analysis ? (
            <>
              <pre className="reference-text">{analysis}</pre>
              <ReferenceActions
                key={design.slug}
                lang={lang}
                content={analysis}
                source={source || design.title}
              />
            </>
          ) : (
            <p>
              {t(
                "这个参考暂未提供设计分析。",
                "No design analysis is available for this reference.",
              )}
            </p>
          )}
        </>
      )}
      <div className="kage-source-links">
        {design.source && (
          <a href={design.source} target="_blank" rel="noreferrer">
            {t("查看 Kage 来源", "View Kage source")}
          </a>
        )}
        {design.website && (
          <a href={design.website} target="_blank" rel="noreferrer">
            {t("访问原产品", "Visit original product")}
          </a>
        )}
      </div>
      <p className="kage-attribution">
        {t(
          "来源：Kage。截图属于原产品，仅供设计参考；分析保留上游原文。",
          "Source: Kage. Screenshots belong to their products and are shown for design reference; analysis is the original source text.",
        )}
      </p>
      <dialog
        className="kage-image-dialog"
        ref={dialog}
        aria-label={t("参考图大图", "Enlarged reference image")}
      >
        <div className="kage-dialog-toolbar">
          <strong>{imageTitle}</strong>
          <Button onClick={() => dialog.current?.close()}>
            {t("关闭大图", "Close image")}
          </Button>
        </div>
        <div className="kage-dialog-image">
          <KageImage src={image} title={imageTitle} lang={lang} />
        </div>
      </dialog>
    </section>
  );
}
