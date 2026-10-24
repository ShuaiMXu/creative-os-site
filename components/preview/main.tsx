import React, { Component, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { previews } from "./generated/loaders";
import "./generated/preview.css";
import "./runtime.css";

const params = new URLSearchParams(location.search);
const id = params.get("component") || "shift-card";
const zh = params.get("lang") === "zh";
document.documentElement.classList.toggle(
  "dark",
  params.get("theme") === "dark",
);
document.documentElement.style.colorScheme =
  params.get("theme") === "dark" ? "dark" : "light";
document.documentElement.lang = zh ? "zh-CN" : "en";
const reduced =
  params.get("motion") !== "on" ||
  matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.dataset.motion = reduced ? "reduce" : "on";
class Boundary extends Component<React.PropsWithChildren, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p role="alert">
        {zh
          ? "此示例运行失败，请查看源码与接入条件。"
          : "This example could not run. See its source and integration requirements."}
      </p>
    ) : (
      this.props.children
    );
  }
}
// Original samples may contain outbound links or forms; the gallery is for local interaction only.
document.addEventListener(
  "click",
  (event) => {
    const link = (event.target as Element).closest?.("a");
    // The reviewed texture demo downloads only its local asset via a blob URL.
    if (id === 'bg-image-texture' && link?.hasAttribute('download') && (link.href.startsWith(`blob:${location.origin}/`) || link.href.startsWith("blob:null/"))) return;
    if (link) {
      event.preventDefault();
      document.getElementById("preview-note")!.textContent = zh
        ? "演示链接，不会跳转或提交数据。"
        : "Demo link; no navigation or data submission.";
    }
  },
  true,
);
document.addEventListener("submit", (event) => event.preventDefault(), true);
const Demo = previews[id] ? lazy(previews[id]) : null;
createRoot(document.getElementById("root")!).render(
  <>
    <div className="preview-runtime" data-preview={id}>
      <Boundary>
        <MotionConfig reducedMotion={reduced ? "always" : "user"}>
          <Suspense
            fallback={<p>{zh ? "正在载入组件…" : "Loading component…"}</p>}
          >
            {Demo ? (
              <Demo />
            ) : (
              <p role="alert">
                {zh
                  ? "此组件尚未提供站内预览。"
                  : "No local preview is available."}
              </p>
            )}
          </Suspense>
        </MotionConfig>
      </Boundary>
    </div>
    <p id="preview-note" role="status" />
  </>,
);
