import { useEffect, useRef, useState } from "react";
import {
  variables,
  type ThemeStyles,
  type Mode,
} from "../../packages/theme-core";
export function ConnectedPreview({
  styles,
  mode,
}: {
  styles: ThemeStyles;
  mode: Mode;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [input, setInput] = useState(`${location.origin}/studio-preview.html`);
  const [url, setUrl] = useState(input);
  const [load, setLoad] = useState(0);
  const [status, setStatus] = useState("等待预览连接");
  const [ready, setReady] = useState(false);
  const nonce = useRef("");
  useEffect(() => {
    setReady(false);
    setStatus("正在连接…");
    nonce.current = crypto.randomUUID();
    const origin = new URL(url).origin;
    const ping = () =>
      frame.current?.contentWindow?.postMessage(
        {
          protocol: "happyhands-preview-v1",
          type: "PING",
          nonce: nonce.current,
        },
        origin,
      );
    const listener = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== origin ||
        event.data?.protocol !== "happyhands-preview-v1" ||
        event.data?.nonce !== nonce.current
      )
        return;
      if (event.data.type === "READY") {
        setReady(true);
        setStatus("已连接 · 主题同步中");
        clearInterval(interval);
        clearTimeout(timeout);
      }
      if (event.data.type === "APPLIED") setStatus("已连接 · 主题已应用");
    };
    window.addEventListener("message", listener);
    const interval = setInterval(ping, 400);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStatus("未能连接：请检查桥接脚本、允许来源和页面嵌入策略。");
    }, 6000);
    ping();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener("message", listener);
    };
  }, [url, load]);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(
      () =>
        frame.current?.contentWindow?.postMessage(
          {
            protocol: "happyhands-preview-v1",
            type: "THEME",
            nonce: nonce.current,
            mode,
            variables: variables(styles, mode),
          },
          new URL(url).origin,
        ),
      60,
    );
    return () => clearTimeout(timer);
  }, [ready, styles, mode, url, load]);
  return (
    <div className="connected-preview">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const next = new URL(input);
            if (
              !["http:", "https:"].includes(next.protocol) ||
              next.username ||
              next.password
            )
              throw Error();
            setUrl(next.href);
            setLoad((n) => n + 1);
          } catch {
            setStatus("请输入不含凭据的 HTTP(S) 预览地址");
          }
        }}
      >
        <input
          aria-label="项目预览地址"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>连接</button>
      </form>
      <p role="status">{status}</p>
      <iframe
        ref={frame}
        title="受控项目页面"
        src={url}
        onLoad={() => setLoad((n) => n + 1)}
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
      />
      <details>
        <summary>如何接入自己的页面</summary>
        <p>
          仅用于你控制的开发预览。安装脚本后，将 data-studio-origin 设置为当前
          Studio 来源。页面还需允许被该来源嵌入。
        </p>
        <pre>{`<script src="/happyhands-preview.js" data-studio-origin="${location.origin}"></script>`}</pre>
        <a href="/happyhands-preview.js" download>
          下载桥接脚本
        </a>
      </details>
    </div>
  );
}
