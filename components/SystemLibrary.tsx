import React, { useEffect, useState, useRef } from "react";
const systems = [
  { id: "happyhands", name: "HappyHands", zh: "品牌规范与产品组件", en: "Brand rules and product components" },
  { id: "quartz", name: "Quartz", zh: "AI 工作流与专业工具", en: "AI workflows and professional tools" },
  { id: "lime", name: "Lime", zh: "个人助手与消费类应用", en: "Personal assistants and consumer apps" },
] as const;
export function SystemLibrary({ lang }: { lang: string }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const read = () =>
    systems.find(
      (system) =>
        system.id === new URLSearchParams(location.search).get("system"),
    )?.id || "happyhands";
  const [selected, setSelected] = useState(read);
  useEffect(() => {
    const update = () => setSelected(read());
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);
  useEffect(() => {
    setHeight(1200);
  }, [selected]);
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== "system-content-height"
      )
        return;
      const value = event.data.height;
      if (typeof value === "number" && Number.isFinite(value) && value > 0)
        setHeight(Math.min(30000, Math.ceil(value)));
    };
    addEventListener("message", resize);
    return () => removeEventListener("message", resize);
  }, []);
  const name = systems.find((system) => system.id === selected)!.name;
  const base = `/systems/${selected}/`;
  return (
    <>
      <nav
        className="provider-navigation system-cover-navigation"
        aria-label={t("资源来源", "Resource sources")}
      >
        {systems.map(({ id, name, zh, en }) => (
          <a
            href={`?provider=systems&system=${id}`}
            key={id}
            aria-current={selected === id ? "page" : undefined}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setSelected(id);
              history.pushState(null, "", `?provider=systems&system=${id}`);
            }}
          >
            <img src={`/system-covers/${id}.svg`} alt="" width="600" height="320" />
            <div className="system-cover-label"><strong>{name}</strong><p>{t(zh, en)}</p><small>{selected === id ? t("正在查看", "Selected") : t("查看设计系统", "Explore system")}</small></div>
          </a>
        ))}
      </nav>
      <main id="catalog-main" className="system-library-full">
        <iframe
          ref={frame}
          key={selected}
          title={t(`${name} 完整设计规范`, `${name} complete design system`)}
          src={`${base}?embedded=1`}
          style={{ height }}
        />
      </main>
    </>
  );
}
