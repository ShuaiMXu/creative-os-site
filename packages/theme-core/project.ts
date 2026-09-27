import {
  keys,
  colorKeys,
  presetStyles,
  revision,
  validateStyles,
  differences,
  type ThemeStyles,
} from "./index";
import Ajv from "ajv/dist/2020";
import foundationSchema from "../contracts/foundation.schema.json";
const checkFoundation = new Ajv({ allErrors: true }).compile(foundationSchema);
import type { Draft, FoundationApproval } from "../contracts";
export type { Draft, FoundationApproval } from "../contracts";
export function newDraft(id: string, project: string): Draft {
  const styles = presetStyles("happyhands");
  return {
    schemaVersion: "0.2",
    status: "draft",
    id,
    project,
    revision: 0,
    styles,
    baseline: structuredClone(styles),
    provenance: { revision, source: "happyhands" },
  };
}

export function attachFoundation(
  draft: Draft,
  input: unknown,
): { draft: Draft; mapped: number } {
  const foundation = validateFoundation(input);
  const styles = structuredClone(draft.styles);
  let mapped = 0;
  for (const mode of ["light", "dark"] as const)
    for (const key of keys) {
      const token = foundation.foundation.tokens.find(
        (t) => t.name === `theme.${mode}.${key}` && t.status === "approved",
      );
      if (token && typeof token.value === "string") {
        styles[mode][key] = token.value;
        mapped++;
      }
    }
  validateStyles(styles);
  return {
    draft: { ...draft, foundation, styles, baseline: structuredClone(styles) },
    mapped,
  };
}
export function validateFoundation(input: unknown): FoundationApproval {
  const d = input as FoundationApproval;
  if (
    !d ||
    d.schemaVersion !== "0.1" ||
    !/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(d.foundationVersion) ||
    !["human", "team"].includes(d.reviewer?.type) ||
    !d.reviewer?.name?.trim() ||
    !d.reason?.trim()
  )
    throw Error("不是有效的 Harness Foundation 批准文件");
  const f = d.foundation;
  if (
    !f ||
    !Array.isArray(f.brand?.principles) ||
    !Array.isArray(f.brand?.voice)
  )
    throw Error("Foundation 缺少品牌信息");
  for (const entries of [f.brand.assets, f.tokens, f.components, f.patterns])
    if (
      !Array.isArray(entries) ||
      entries.some(
        (e) =>
          !e ||
          typeof e.name !== "string" ||
          !["approved", "deprecated"].includes(e.status),
      )
    )
      throw Error("Foundation 包含未决定的条目");
  if (
    ![...f.tokens, ...f.components, ...f.patterns].some(
      (e) => e.status === "approved",
    )
  )
    throw Error("Foundation 没有批准条目");
  if (!checkFoundation({ ...f, status: "approved" }))
    throw Error(
      `Foundation 不兼容 Harness：${checkFoundation.errors?.map((e) => `${e.instancePath} ${e.message}`).join("; ")}`,
    );
  return structuredClone(d);
}
export function validateDraft(input: unknown): Draft {
  const d = input as Draft;
  if (
    !d ||
    d.schemaVersion !== "0.2" ||
    d.status !== "draft" ||
    !/^[a-zA-Z0-9_-]{1,80}$/.test(d.id) ||
    typeof d.project !== "string" ||
    d.project.length > 200 ||
    !Number.isInteger(d.revision) ||
    d.revision < 0 ||
    !d.provenance ||
    typeof d.provenance.source !== "string" ||
    typeof d.provenance.revision !== "string"
  )
    throw Error("草稿格式无效");
  return {
    ...d,
    styles: validateStyles(d.styles),
    baseline: validateStyles(d.baseline),
    foundation: d.foundation ? validateFoundation(d.foundation) : undefined,
  };
}
export type History = {
  past: ThemeStyles[];
  present: ThemeStyles;
  future: ThemeStyles[];
  group?: string;
  at: number;
};
export function history(styles: ThemeStyles): History {
  return { past: [], present: structuredClone(styles), future: [], at: 0 };
}
export function edit(
  h: History,
  styles: ThemeStyles,
  group?: string,
  now = Date.now(),
): History {
  if (!differences(h.present, styles).length) return h;
  const coalesce =
    group && group === h.group && now - h.at < 500 && !h.future.length;
  return {
    past: coalesce ? h.past : [...h.past, h.present].slice(-30),
    present: styles,
    future: [],
    group,
    at: now,
  };
}
export function undo(h: History): History {
  return h.past.length
    ? {
        past: h.past.slice(0, -1),
        present: h.past.at(-1)!,
        future: [h.present, ...h.future],
        at: 0,
      }
    : h;
}
export function redo(h: History): History {
  return h.future.length
    ? {
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1),
        at: 0,
      }
    : h;
}
export function createProposal(draft: Draft) {
  return {
    schemaVersion: "0.1",
    status: "proposed",
    projectId: draft.id,
    baseFoundationVersion: draft.foundation?.foundationVersion ?? null,
    draftRevision: draft.revision,
    changes: differences(draft.baseline, draft.styles),
    provenance: draft.provenance,
    styles: draft.styles,
  };
}
export function approve(
  draft: Draft,
  version: string,
  name: string,
  reason: string,
  currentVersion?: string,
): FoundationApproval {
  if (currentVersion !== draft.foundation?.foundationVersion)
    throw Error("基础版本已变化，请重新载入后合并");
  if (!/^\d+\.\d+\.\d+$/.test(version) || !name.trim() || !reason.trim())
    throw Error("请填写语义版本、审核人和批准理由");
  if (currentVersion) {
    const a = version.split(".").map(Number),
      b = currentVersion.split(".").map(Number);
    let cmp = 0;
    for (let i = 0; i < 3; i++) {
      if (a[i] !== b[i]) {
        cmp = a[i] - b[i];
        break;
      }
    }
    if (cmp <= 0) throw Error("新版本必须大于基础版本");
  }
  const styles = validateStyles(draft.styles);
  const f = structuredClone(
    draft.foundation?.foundation ?? {
      brand: { principles: [], voice: [], assets: [] },
      tokens: [],
      components: [],
      patterns: [],
    },
  );
  const mapped = (["light", "dark"] as const).flatMap((mode) =>
    keys.map((key) => ({
      name: `theme.${mode}.${key}`,
      value: styles[mode][key],
      category: colorKeys.includes(key)
        ? "color"
        : key.startsWith("font-") || key === "letter-spacing"
          ? "type"
          : key.startsWith("shadow-")
            ? "shadow"
            : key === "radius"
              ? "radius"
              : "space",
      usage: `Apply --${key} under ${mode === "light" ? ":root" : ".dark"}; preserve the other mode.`,
      source: `happyhands-studio:${draft.id}@${draft.revision}`,
      status: "approved" as const,
    })),
  );
  const mappedNames = new Set(mapped.map((t) => t.name));
  f.tokens = [...f.tokens.filter((t) => !mappedNames.has(t.name)), ...mapped];
  // Names carry mode even in the existing Harness text serializer; values remain primitive.
  const result = {
    schemaVersion: "0.1" as const,
    foundationVersion: version,
    reviewer: { type: "human" as const, name: name.trim() },
    reason: reason.trim(),
    reviewedAt: new Date().toISOString(),
    foundation: f,
  };
  return validateFoundation(result);
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function saveDraft(
  storage: StorageLike,
  draft: Draft,
  expected: number,
): Draft {
  const key = `hh-studio:${draft.id}`;
  const stored = storage.getItem(key);
  if (stored && validateDraft(JSON.parse(stored)).revision !== expected)
    throw Error("另一个窗口修改了该项目。请先导出备份，再重新载入，避免覆盖。");
  const next = validateDraft({ ...draft, revision: expected + 1 });
  storage.setItem(key, JSON.stringify(next));
  return next;
}
