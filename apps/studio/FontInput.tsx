import { useEffect, useRef, useState } from "react";
import { presetStyles, validateValue } from "../../packages/theme-core";
import { t } from "./i18n";

type FontKey = "font-sans" | "font-serif" | "font-mono";
const defaults = presetStyles("happyhands").light;
const fonts: Record<FontKey, { label: string; value: string }[]> = {
  "font-sans": [
    { label: "HappyHands · 苹方优先", value: defaults["font-sans"] },
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
    { label: "HappyHands · 等宽", value: defaults["font-mono"] },
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
  const input = useRef<HTMLTextAreaElement>(null);
  const options = fonts[name];
  const match = options.find((font) => font.value === value);
  useEffect(() => {
    setText(value);
    setInvalid(false);
    setCustom(false);
  }, [value]);
  return (
    <div className="font-control" id={`token-${name}`}>
      <label htmlFor={`${name}-select`}>
        {t(labels[name])}
        <small>{name}</small>
      </label>
      <select
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
        {options.map((font) => (
          <option key={font.value} value={font.value}>
            {t(font.label)}
          </option>
        ))}
        <option value="custom">{t("自定义字体")}</option>
      </select>
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
            : "可直接编辑；字体需已安装或由项目加载，否则使用备用字体。",
        )}
      </p>
      <div
        className="font-specimen"
        style={{ fontFamily: value }}
        aria-label={t("字体预览")}
      >
        <span>{t("让设计有据可依。")}</span>
        <span>Design with intention. 0123456789</span>
      </div>
    </div>
  );
}
