import { Select } from "../../packages/ui/Select";
import { useEffect, useRef, useState } from "react";
import { presetStyles, validateValue } from "../../packages/theme-core";
import { t } from "./i18n";
import {
  fontImports,
  fontsInStack,
  fontStack,
  openFonts,
  previewFontStack,
} from "../../packages/font-library";
import { useFontLoading } from "./useFontLoading";

type FontKey = "font-sans" | "font-serif" | "font-mono";
const defaults = presetStyles("happyhands").light;
const fonts: Record<FontKey, { label: string; value: string }[]> = {
  "font-sans": [
    { label: "HappyHands / 苹方优先", value: defaults["font-sans"] },
    { label: "系统无衬线", value: 'system-ui, "Microsoft YaHei", sans-serif' },
    {
      label: "微软雅黑",
      value: '"Microsoft YaHei", "PingFang SC", sans-serif',
    },
    { label: "Arial", value: 'Arial, "Microsoft YaHei", sans-serif' },
  ],
  "font-serif": [
    { label: "系统衬线", value: defaults["font-serif"] },
    { label: "宋体", value: '"Songti SC", SimSun, serif' },
    { label: "Georgia", value: 'Georgia, "Songti SC", SimSun, serif' },
    {
      label: "Times New Roman",
      value: '"Times New Roman", "Songti SC", SimSun, serif',
    },
  ],
  "font-mono": [
    { label: "HappyHands / 等宽", value: defaults["font-mono"] },
    { label: "系统等宽", value: "ui-monospace, monospace" },
    { label: "Consolas", value: 'Consolas, "Liberation Mono", monospace' },
    { label: "Courier New", value: '"Courier New", Courier, monospace' },
  ],
};
const labels: Record<FontKey, string> = {
  "font-sans": "正文字体",
  "font-serif": "衬线字体",
  "font-mono": "等宽字体",
};

export function FontInput({
  name,
  value,
  onChange,
}: {
  name: FontKey;
  value: string;
  onChange: (value: string) => void;
}) {
  const [text, setText] = useState(value);
  const [custom, setCustom] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const library = openFonts.filter(
    (font) =>
      font.category === name.replace("font-", "") ||
      (name !== "font-mono" && font.category === "chinese"),
  );
  const options = [
    ...fonts[name],
    ...library.map((font) => ({ label: font.zh, value: fontStack(font) })),
  ];
  const match = options.find((font) => font.value === value);
  const selectedFonts = fontsInStack(value);
  const { status, retry } = useFontLoading(value);
  const imports = fontImports(value, location.origin);
  useEffect(() => {
    setText(value);
    setInvalid(false);
    setCustom(false);
    setCopied(false);
    setCopyFailed(false);
  }, [value]);
  return (
    <div className="font-control" id={`token-${name}`}>
      <label htmlFor={`${name}-select`}>
        {t(labels[name])}
        <small>{name}</small>
      </label>
      <Select
        id={`${name}-select`}
        value={custom || !match ? "custom" : value}
        onChange={(event) => {
          if (event.target.value === "custom") {
            setCustom(true);
            input.current?.focus();
          } else {
            setCustom(false);
            setText(event.target.value);
            setInvalid(false);
            onChange(event.target.value);
          }
        }}
      >
        <optgroup label={t("系统与本地字体")}>
          {fonts[name].map((font) => (
            <option key={font.value} value={font.value}>
              {t(font.label)}
            </option>
          ))}
        </optgroup>
        {name !== "font-mono" && (
          <optgroup label={t("中文开源字体")}>
            {library
              .filter((font) => font.category === "chinese")
              .map((font) => (
                <option key={font.id} value={fontStack(font)}>
                  {t(font.zh)}
                </option>
              ))}
          </optgroup>
        )}
        <optgroup
          label={t(
            name === "font-mono"
              ? "开源等宽字体"
              : name === "font-serif"
                ? "西文开源衬线"
                : "西文开源无衬线",
          )}
        >
          {library
            .filter((font) => font.category !== "chinese")
            .map((font) => (
              <option key={font.id} value={fontStack(font)}>
                {font.family}
              </option>
            ))}
        </optgroup>
        <option value="custom">{t("自定义字体")}</option>
      </Select>
      <label className="font-stack-label" htmlFor={`${name}-custom`}>
        {t("字体与备用字体")}
      </label>
      <textarea
        ref={input}
        id={`${name}-custom`}
        aria-label={name}
        rows={2}
        value={text}
        aria-invalid={invalid}
        aria-describedby={`${name}-help`}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          try {
            validateValue(name, next);
            setInvalid(false);
            if (next !== value) onChange(next);
          } catch {
            setInvalid(true);
          }
        }}
      />
      <p
        id={`${name}-help`}
        className="micro"
        role={invalid ? "alert" : undefined}
      >
        {t(
          invalid
            ? "请输入有效的字体名称与备用字体；预览保留上一个有效值。"
            : selectedFonts.length
              ? "开源字体由本站按需加载；导出主题后请同时引入字体样式。"
              : "可直接编辑；字体需已安装或由项目加载，否则使用备用字体。",
        )}
      </p>
      {selectedFonts.length > 0 && (
        <>
          <div className="font-load-status" data-font-state={status}>
            <span role="status">
              {t(
                status === "loading"
                  ? "正在加载开源字体…"
                  : status === "ready"
                    ? "字体已加载 / OFL-1.1"
                    : status === "error"
                      ? "字体加载失败，当前显示备用字体。"
                      : "正在准备字体…",
              )}
            </span>
            {status === "error" && (
              <button type="button" onClick={retry}>
                {t("重试加载")}
              </button>
            )}
          </div>
          <details className="font-install">
            <summary>{t("来源、许可证与项目接入")}</summary>
            {selectedFonts.map((font) => (
              <p key={font.id}>
                {font.family}  / {" "}
                <a href={font.source} target="_blank" rel="noreferrer">
                  {t("字体来源")}
                </a>{" "}
                 / {" "}
                <a href={font.licenseUrl} target="_blank" rel="noreferrer">
                  OFL-1.1
                </a>
              </p>
            ))}
            <p className="micro">
              {t("将以下引用放在项目全局 CSS 顶部；自托管时请一并保留许可证。")}
            </p>
            <textarea readOnly value={imports} aria-label={t("字体引用代码")} />
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(imports);
                  setCopied(true);
                  setCopyFailed(false);
                } catch {
                  setCopyFailed(true);
                }
              }}
            >
              {t(copied ? "已复制字体引用" : "复制字体引用")}
            </button>
            {copyFailed && (
              <p role="status" className="micro">
                {t("复制不可用，请手动复制上方代码。")}
              </p>
            )}
          </details>
        </>
      )}
      <div
        className="font-specimen"
        style={{ fontFamily: previewFontStack(value) }}
        aria-label={t("字体预览")}
      >
        <span>{t("让设计有据可依。")}</span>
        <span>Design with intention. 0123456789</span>
      </div>
    </div>
  );
}
