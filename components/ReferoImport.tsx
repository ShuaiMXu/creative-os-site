import React, { useRef, useState } from "react";
import { ReferenceActions } from "./ReferenceActions";
const limit = 256 * 1024;
export function ReferoImport({ lang }: { lang: string }) {
  const zh = lang === "zh",
    [content, setContent] = useState(""),
    [name, setName] = useState(""),
    [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null),
    version = useRef(0);
  async function importFile(file?: File) {
    const id = ++version.current;
    setError("");
    if (!file) return;
    try {
      if (!/\.md$/i.test(file.name) || file.size > limit)
        throw Error(
          zh
            ? "请选择不超过 256 KB 的 .md 文件。"
            : "Choose a .md file up to 256 KB.",
        );
      const text = new TextDecoder("utf-8", { fatal: true }).decode(
        await file.arrayBuffer(),
      );
      if (!text.trim() || text.includes("\0"))
        throw Error(
          zh
            ? "文件为空或不是有效的 Markdown 文本。"
            : "The file is empty or is not valid Markdown text.",
        );
      if (id === version.current) {
        setContent(text);
        setName(file.name);
      }
    } catch (e) {
      if (id === version.current)
        setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (input.current) input.current.value = "";
    }
  }
  return (
    <main id="catalog-main" className="provider-reference">
      <p className="catalog-eyebrow">Refero Styles / DESIGN.md</p>
      <h2>
        {zh
          ? "导入风格规范，对照项目设计"
          : "Import style guidelines for your project"}
      </h2>
      <p>
        {zh
          ? "从 Refero 导出你有权使用的 DESIGN.md，在这里阅读，再交给 Agent 对照项目现有规范。"
          : "Export an authorized DESIGN.md from Refero, review it here, then compare it with your project guidelines through your Agent."}
      </p>
      <a href="https://styles.refero.design/" target="_blank" rel="noreferrer">
        {zh ? "浏览 Refero Styles" : "Browse Refero Styles"}
      </a>
      <section className="reference-import">
        <label>
          {zh ? "导入 DESIGN.md" : "Import DESIGN.md"}
          <input
            ref={input}
            type="file"
            accept=".md,text/markdown"
            onChange={(e) => void importFile(e.target.files?.[0])}
          />
        </label>
        <p>
          {zh
            ? "仅在当前页面读取，不上传、不公开保存。支持 UTF-8 Markdown，最大 256 KB；离开页面后清除。"
            : "Read only in this page, without upload or public storage. UTF-8 Markdown, up to 256 KB. Cleared when you leave."}
        </p>
        <p role="alert">{error}</p>
      </section>
      {content && (
        <section className="reference-document">
          <div className="reference-document-heading">
            <h3>{name}</h3>
            <button
              onClick={() => {
                version.current++;
                setContent("");
                setName("");
                setError("");
              }}
            >
              {zh ? "清除文件" : "Clear file"}
            </button>
          </div>
          <p>
            {zh
              ? "以下保留文件原文，链接、图片及 HTML 不会自动加载或执行。风格分析不代表原产品的官方规范。"
              : "Original file text. Links, images and HTML are not loaded or executed. Style analysis is not the original product’s official guidelines."}
          </p>
          <pre className="reference-text">{content}</pre>
          <ReferenceActions
            key={content}
            lang={lang}
            content={content}
            source={`Refero Styles / ${name} (user import)`}
          />
        </section>
      )}
    </main>
  );
}
