import test from "node:test";
import assert from "node:assert/strict";
import postcss from "postcss";
import tailwind3 from "tailwindcss-v3";
import { compile } from "@tailwindcss/node";
import { createRequire } from "node:module";
import {
  presets,
  presetStyles,
  setToken,
  validateStyles,
  importCSS,
  exportTheme,
  variables,
  adjustHsl,
  contrastChecks,
} from "../packages/theme-core/index.ts";
import {
  newDraft,
  history,
  edit,
  undo,
  redo,
  saveDraft,
  approve,
  validateFoundation,
} from "../packages/theme-core/project.ts";

test("all upstream presets have valid complete light/dark tokens", () => {
  for (const id of Object.keys(presets))
    assert.doesNotThrow(() => validateStyles(presetStyles(id)), id);
});
test("mode colors independent, common dimensions shared, invalid CSS rejected", () => {
  const a = presetStyles("default");
  const b = setToken(a, "dark", "primary", "#123456");
  assert.equal(b.light.primary, a.light.primary);
  assert.equal(setToken(b, "light", "radius", "1rem").dark.radius, "1rem");
  assert.throws(() => setToken(a, "light", "primary", "url(https://bad)"));
  assert.throws(() => setToken(a, "light", "radius", "-1rem"));
  assert.throws(() => setToken(a, "light", "shadow-opacity", "2"));
});
test("history coalesces changes, redo branch is invalidated after undo", () => {
  const a = presetStyles("default"),
    b = setToken(a, "light", "primary", "#123456"),
    c = setToken(b, "light", "primary", "#234567");
  let h = edit(history(a), b, "primary", 100);
  h = edit(h, c, "primary", 200);
  assert.equal(h.past.length, 1);
  h = undo(h);
  assert.deepEqual(h.present, a);
  assert.deepEqual(redo(h).present, c);
  h = edit(h, b, "primary", 250);
  assert.equal(h.future.length, 0);
  assert.deepEqual(undo(h).present, a);
});
test("AST importer accepts layered variables, reports aliases, unknown and conditional scopes", () => {
  const base = presetStyles("default");
  const r = importCSS(
    "@layer base { :root { --primary: 200 50% 40%; --unknown: red; --border: var(--x); } .dark { --primary: #123456; } } @media (width > 1px) { :root { --primary: red; } }",
    base,
  );
  assert.equal(r.count, 2);
  assert.equal(r.styles.dark.primary, "#123456");
  assert.equal(r.warnings.length, 3);
  assert.equal(r.styles.light.primary, "hsl(200 50% 40%)");
  assert.throws(() => importCSS(":root { --primary:", base));
});
test("CSS round trip and exports do not mutate draft; alpha survives output", () => {
  const styles = setToken(
    presetStyles("default"),
    "light",
    "primary",
    "rgba(20, 40, 60, 0.5)",
  );
  const frozen = JSON.stringify(styles);
  const exported = exportTheme(styles, "css");
  assert.deepEqual(
    importCSS(exported, presetStyles("happyhands")).styles,
    styles,
  );
  for (const kind of [
    "tailwind3",
    "tailwind4",
    "registry",
    "tailwind3-config",
  ] as const)
    exportTheme(styles, kind);
  assert.equal(JSON.stringify(styles), frozen);
  assert.match(exportTheme(styles, "tailwind4"), /rgba\(20, 40, 60, 0.5\)/);
  assert.equal(
    contrastChecks(styles, "light").find((c) => c.bg === "primary")?.ratio,
    null,
  );
});
test("HSL edits are immutable, shadows derive from configured dimensions", () => {
  const a = presetStyles("happyhands");
  const b = adjustHsl(a, "light", 35, 1, 1);
  assert.notEqual(a.light.primary, b.light.primary);
  assert.equal(a.dark.primary, b.dark.primary);
  assert.match(
    variables(setToken(a, "light", "shadow-blur", "20px"), "light")[
      "--shadow-md"
    ],
    /20px/,
  );
});
test("project persistence rejects stale revisions and isolates projects", () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
  const a = newDraft("one", "One"),
    b = newDraft("two", "Two");
  const saved = saveDraft(storage, a, 0);
  saveDraft(storage, b, 0);
  assert.equal(saved.revision, 1);
  assert.throws(() => saveDraft(storage, a, 0));
  assert.equal(map.size, 2);
});
test("Foundation preserves brand and components, rejects version conflicts and invalid entries", () => {
  const d = newDraft("test", "Test");
  const original = approve(d, "1.0.0", "Tester", "Initial", undefined);
  original.foundation.brand.principles = ["Keep identity"];
  original.foundation.components = [
    {
      name: "Button",
      source: "src/Button",
      variants: ["primary"],
      states: ["default"],
      status: "approved",
    },
  ];
  d.foundation = original;
  const next = approve(d, "1.1.0", "Tester", "Adjust theme", "1.0.0");
  assert.deepEqual(next.foundation.components, original.foundation.components);
  assert.deepEqual(next.foundation.brand, original.foundation.brand);
  assert.equal(
    next.foundation.tokens.length,
    original.foundation.tokens.length,
  );
  assert.throws(() => approve(d, "1.0.0", "Tester", "x", "1.0.0"));
  assert.throws(() => approve(d, "2.0.0", "Tester", "x", "9.0.0"));
  const invalid = structuredClone(next);
  invalid.foundation.tokens[0].category = "typography";
  assert.throws(() => validateFoundation(invalid));
});
test("Tailwind 3 exported CSS/config compiles semantic utilities", async () => {
  const styles = presetStyles("happyhands");
  const configText = exportTheme(styles, "tailwind3-config");
  const module = { exports: {} };
  new Function("module", configText)(module);
  const config = {
    ...module.exports,
    content: [
      {
        raw: '<div class="bg-primary text-primary-foreground rounded-lg"></div>',
      },
    ],
  };
  const result = await postcss([tailwind3(config)]).process(
    exportTheme(styles, "tailwind3"),
    { from: undefined },
  );
  assert.match(result.css, /\.bg-primary/);
  assert.match(result.css, /--primary/);
});
test("Tailwind 4 exported CSS compiles semantic and dark utilities", async () => {
  const compiler = await compile(
    exportTheme(presetStyles("happyhands"), "tailwind4"),
    { base: process.cwd(), onDependency: () => {} },
  );
  const result = compiler.build([
    "bg-primary",
    "text-primary-foreground",
    "dark:bg-card",
    "rounded-lg",
  ]);
  assert.match(result, /\.bg-primary/);
  assert.match(result, /--primary/);
});

test("CSS import preserves important precedence and recognizes upstream shadow aliases", () => {
  const r = importCSS(
    ":root { --primary: #123456 !important; --primary: #ffffff; --shadow-x: 4px; --tracking-normal: 0.02em; }",
    presetStyles("default"),
  );
  assert.equal(r.styles.light.primary, "#123456");
  assert.equal(r.styles.light["shadow-offset-x"], "4px");
  assert.equal(r.styles.light["letter-spacing"], "0.02em");
});

test("approval compares prerelease numeric components without permitting downgrades", () => {
  const d = newDraft("versions", "Versions");
  d.foundation = approve(d, "1.2.10", "Reviewer", "Base");
  d.foundation.foundationVersion = "1.2.10-beta.1";
  assert.throws(() =>
    approve(d, "1.2.9", "Reviewer", "Downgrade", "1.2.10-beta.1"),
  );
  assert.equal(
    approve(d, "1.2.10", "Reviewer", "Release", "1.2.10-beta.1")
      .foundationVersion,
    "1.2.10",
  );
});
test("deleting a saved draft cannot be silently undone by a stale tab", () => {
  const storage = {
    getItem: () => null,
    setItem: () => assert.fail("must not recreate deleted project"),
  };
  assert.throws(
    () => saveDraft(storage, newDraft("deleted", "Deleted"), 4),
    /已被删除/,
  );
});

test("Tailwind exports retain imported dark-only spacing and tracking", () => {
  const styles = presetStyles("default");
  styles.light["letter-spacing"] = "0em";
  styles.dark["letter-spacing"] = "0.04em";
  styles.dark.spacing = "0.5rem";
  for (const kind of ["tailwind3", "tailwind4"] as const) {
    const css = exportTheme(styles, kind);
    const dark = css.match(/\.dark\s*\{([^}]+)\}/)?.[1] || "";
    assert.match(dark, /--spacing: 0.5rem/);
    assert.match(dark, /--tracking-normal: 0.04em/);
    assert.match(css, /letter-spacing: var\(--tracking-normal\)/);
  }
});
