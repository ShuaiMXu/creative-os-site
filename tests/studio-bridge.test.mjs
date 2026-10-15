import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const source = readFileSync(
  new URL("../public/happyhands-preview.js", import.meta.url),
  "utf8",
);
function harness() {
  let listener;
  const applied = {},
    replies = [];
  const parent = {
    postMessage: (data, origin) => replies.push({ data, origin }),
  };
  const root = {
    style: {
      setProperty: (k, v) => {
        applied[k] = v;
      },
    },
    classList: { toggle: () => {} },
  };
  const document = {
    currentScript: { dataset: { studioOrigin: "http://localhost:4173" } },
    createElement: () => ({ style: { setProperty: () => {} } }),
    documentElement: root,
  };
  const window = {
    parent,
    addEventListener: (_type, fn) => {
      listener = fn;
    },
  };
  vm.runInNewContext(source, { document, window, URL });
  const send = (overrides = {}) =>
    listener({
      source: parent,
      origin: "http://localhost:4173",
      data: {
        protocol: "happyhands-preview-v1",
        type: "THEME",
        nonce: "test",
        mode: "light",
        variables: { "--primary": "#123456" },
      },
      ...overrides,
    });
  return { send, applied, replies, parent };
}
test("bridge applies only valid messages from configured parent and replies to explicit origin", () => {
  const h = harness();
  h.send();
  assert.equal(h.applied["--primary"], "#123456");
  assert.equal(h.replies[0].origin, "http://localhost:4173");
  assert.equal(h.replies[0].data.type, "APPLIED");
});
test("bridge rejects wrong origin, wrong source, protocol and unsafe variables", () => {
  const h = harness();
  h.send({ origin: "https://other.example" });
  h.send({ source: {} });
  h.send({ data: { protocol: "wrong" } });
  h.send({
    data: {
      protocol: "happyhands-preview-v1",
      type: "THEME",
      nonce: "x",
      mode: "light",
      variables: { "--primary": "url(https://bad)" },
    },
  });
  assert.deepEqual(h.applied, {});
  assert.equal(h.replies.length, 0);
});
