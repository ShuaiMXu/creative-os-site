const concepts = {
  a: {
    title: "A · Follow the selection",
    line: "One selection becomes the thread through the whole experience.",
    hook: "A cursor draws one selection around the page. It tightens around the first region to inspect.",
    carry:
      "The same selection survives: page → region → component boundary → source highlight → before/after seam. The cursor visibly causes each change.",
    look: "Chalk canvas, graphite type and a restrained emerald selection. A familiar editor frame recedes during close-ups. Instrument Sans for HappyHands; the demo keeps its own display type.",
    excludes:
      "No scene-by-scene card swaps, unrelated transitions or results without evidence. No fake issue counts, QA verdicts or automatic acceptance.",
    layers: ["Northstar", "Page", "Intro", "Action group", "Design sources"],
    inspector: [
      "Selection",
      "Action group",
      "Inspect spacing",
      "Review source",
      "Confirm scope",
    ],
  },
  b: {
    title: "B · Dive through scale",
    line: "One camera connects the page, its typography and its source.",
    hook: "Begin inside a letterform, then pull back to reveal the type, component and full page in one continuous space.",
    carry:
      "The camera keeps the same page coordinate as its anchor. It moves between page context, readable component detail and source, then returns along the same path.",
    look: "An ink canvas inside light editor chrome, bone-white typography and a quiet citrus focus point. Controlled depth and long still holds; no shake while reading.",
    excludes:
      "No replacing a page with an unrelated screen. No perpetual drifting, tiny unreadable page fly-throughs or arbitrary zooms.",
    layers: ["Northstar", "Page", "Typography", "Letterform", "Source view"],
    inspector: [
      "Typography",
      "Instrument Sans",
      "Read the type",
      "Inspect component",
      "Return to page",
    ],
  },
  c: {
    title: "C · Turn the page inside out",
    line: "The rendered page and its source are two sides of one surface.",
    hook: "Select a control. The same surface turns to reveal the source behind that exact region.",
    carry:
      "One page surface and one highlighted region stay present as front and back exchange roles. The approved edit returns through the same surface into comparison.",
    look: "Cool-gray canvas, white page and restrained blue source marks. A precise, shallow fold between page and code; the outer editor remains a stable spatial reference.",
    excludes:
      "No separate before/code/after slide changes. No push, merge or deployment represented as a one-click side effect.",
    layers: [
      "Northstar",
      "Page surface",
      "Selected region",
      "Source layer",
      "Comparison",
    ],
    inspector: [
      "Change scope",
      "Selected region",
      "Layout only",
      "Review the diff",
      "Confirm change",
    ],
  },
};
const logo = "/brand/happyhands-logo-ink.png";
const site = () =>
  `<article class="northstar-page"><div class="site-nav"><span class="site-name">Northstar</span><div class="site-links"><span>Work</span><span>Studio</span><span>Contact</span></div></div><div class="site-main"><h2>Ideas into products.</h2><p>Digital products, thoughtfully put together.</p><span class="site-button">Explore our work <span>↗</span><span class="selection-outline"><span class="selection-title">Selected region</span><i></i><i></i><i></i><i></i></span></span></div><div class="site-projects"><section class="project"><strong>Atlas Workspace</strong><p>Product design · Collaboration</p><div class="project-lines"><i></i><i></i><i></i></div></section><section class="project"><strong>Fieldnotes</strong><p>Web design · Publishing</p><div class="project-lines"><i></i><i></i><i></i></div></section></div><div class="site-contact">Have a project in mind? Let's talk. ↗</div><div class="site-footer"><span>Northstar · Demo surface</span><span>Work / Studio / Contact</span></div></article>`;
const pointer = () =>
  `<div class="pointer"><svg viewBox="0 0 30 37" aria-hidden="true"><path d="M2 2 L26 20 L16 21 L13 33 L2 2Z" fill="#213827" stroke="white" stroke-width="2"/></svg><span class="pointer-label">Inspect</span></div>`;
const scenes = {
  a: () =>
    `${site()}<div class="subject-path"></div><div class="selected-token">Component boundary<small>The same selection continues.</small></div>${pointer()}<div class="canvas-caption">The selection is the subject.</div><div class="canvas-bottom"><strong>From the whole page to one precise change.</strong><span>Carry: selection + cursor</span></div>`,
  b: () =>
    `<div class="canvas-caption">One coordinate. Many scales.</div><div class="corner-note">Typography / Letterform</div><div class="film-frame"></div><div class="focal-glyph">Aa</div><div class="glyph-outline"></div><div class="focus-point"></div><div class="focus-window"><strong>Instrument Sans</strong><span>Type → component → page</span></div><div class="scale-rail"><span>Letterform</span><span>Typography</span><b>Component</b><span>Page</span></div><div class="canvas-bottom"><strong>Dive into the detail. Keep the context.</strong><span>Carry: page coordinate</span></div>`,
  c: () =>
    `<div class="canvas-caption">One surface, turned inside out.</div><div class="surface-tag">Page ↔ source</div><div class="surface-front">${site()}</div><div class="surface-back"><div class="source-header">Source layer / Proposed scope</div><pre class="source-code">&lt;Intro&gt;\n  &lt;ActionGroup&gt;\n<span class="source-highlight">    spacing: token</span>    &lt;ActionLink /&gt;\n  &lt;/ActionGroup&gt;\n&lt;/Intro&gt;</pre></div><div class="surface-link">↔</div><div class="canvas-bottom"><strong>The change returns to the same page.</strong><span>Carry: page surface</span></div>`,
};
const editor = document.querySelector("#editor");
function fit() {
  const width = document.querySelector(".preview").clientWidth;
  editor.style.transform = `scale(${width / 1600})`;
}
function render() {
  const id = location.hash.slice(1);
  const key = Object.hasOwn(concepts, id) ? id : "a";
  const c = concepts[key];
  document.title = `${c.title} — HappyHands OneTake study`;
  document.querySelector("#concept-title").textContent = c.title;
  document.querySelector("#concept-line").textContent = c.line;
  for (const k of ["hook", "carry", "look", "excludes"])
    document.querySelector("#" + k).textContent = c[k];
  for (const b of document.querySelectorAll("[data-concept]")) {
    if (b.dataset.concept === key) b.setAttribute("aria-current", "true");
    else b.removeAttribute("aria-current");
  }
  editor.dataset.mode = key;
  editor.innerHTML = `<header class="editor-header"><img src="${logo}" alt="HappyHands"><span class="document">Northstar / Experience review</span><div class="right"><span>Concept ${key.toUpperCase()}</span><span class="share">Canvas direction</span></div></header><aside class="editor-left"><div class="tabs"><span>Layers</span><span>Assets</span></div><div class="page-name">Northstar / Review</div>${c.layers.map((name, i) => `<div class="layer ${i > 1 ? "indent" : ""} ${i === 3 ? "active" : ""}">${i ? "◇ " : ""}${name}</div>`).join("")}<div class="layer-status">Fictional demo surface<br>Concept illustration</div></aside><div class="canvas canvas-${key}">${scenes[key]()}</div><aside class="editor-right"><div class="inspector-title"><strong>Inspect</strong><span>Scope</span></div><div class="property-block"><h4>${c.inspector[0]}</h4><p>${c.inspector[1]}</p></div><div class="property-block"><h4>Next action</h4><p>${c.inspector[2]}</p><p>${c.inspector[3]}</p></div><div class="property-block"><h4>Evidence</h4><p>No live run or result is asserted.</p></div><div class="inspector-action">${c.inspector[4]}</div></aside>`;
  fit();
}
for (const b of document.querySelectorAll("[data-concept]"))
  b.addEventListener("click", () => {
    location.hash = b.dataset.concept;
  });
window.addEventListener("hashchange", render);
new ResizeObserver(fit).observe(document.querySelector(".preview"));
render();
