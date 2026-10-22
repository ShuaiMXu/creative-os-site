import { timing } from "./scenes.js";
const logo = "/brand/happyhands-logo-ink.png";
const scene =
  timing.find(
    (s) => s.id === new URLSearchParams(location.search).get("scene"),
  ) || timing[0];
const img = (cls = "") =>
  `<div class="demo-media ${cls}" role="img" aria-label="Fictional Atlas workspace interface"><div class="demo-top"><span>Atlas</span><span>Workspace / Design sprint</span><span>New task +</span></div><div class="demo-board"><div><strong>Planned</strong><p>Explore the onboarding flow<small>Research</small></p><p>Define content hierarchy<small>Design</small></p></div><div><strong>In progress</strong><p>Build the project overview<small>Design · In review</small></p></div><div><strong>Ready to review</strong><p>Simplify the enquiry form<small>Product</small></p><p>Review keyboard focus<small>Accessibility</small></p></div></div></div>`;
const nav = () =>
  `<div class="web-nav"><span class="northstar">Northstar</span><div class="links"><span>Work</span><span>Studio</span><span>Contact</span></div></div>`;
const intro = (after = false, mark = false) =>
  `<div class="intro"><h1>Ideas into products.</h1><div class="intro-text ${after ? "after" : ""} ${mark ? "outline" : ""}"><p>Digital products, thoughtfully put together.</p><div class="web-btn">Explore our work <span>↗</span></div>${mark ? `<div class="measurement"><span class="measure-line"></span>${after ? "32" : "16"} px</div>` : ""}</div></div>`;
const contactPreview = () =>
  `<div class="web-preview">${nav()}<div class="web-about"><div><h2>Built around people.</h2><span>Our approach ↗</span></div><div><p>Useful digital experiences, designed around real tasks.</p></div></div><div class="enquiry"><h2>Tell us what you have in mind.</h2><div class="form-row"><div class="field">Your name</div><div class="field">Email address</div></div><div class="field">A little about your project</div><p>Start a conversation ↗</p></div><div class="web-footer"><span>Northstar — Digital product studio</span><span>Privacy · Instagram</span></div><div class="callout" style="margin:20px">Reviewing: enquiry entry and field-label context.</div></div>`;
const preview = (after = false, mark = false) =>
  `<div class="web-preview">${nav()}${intro(after, mark)}${img("preview-image")}<div class="web-title"><h2>Selected work</h2><span>View all projects ↗</span></div><div class="mini-section"><h3>Atlas Workspace</h3><p>Product design · A clearer way to work.</p></div></div>`;
const site = () =>
  `<div class="website">${nav()}<div class="web-hero"><h1>Ideas into products.</h1><div class="summary"><p>Digital products, thoughtfully put together.</p><div class="web-btn">Explore our work <span>↗</span></div></div></div>${img("courtyard")}<div class="web-work"><div class="web-title"><h2>Selected work</h2><span>View all projects ↗</span></div><div class="projects"><div>${img()}<h3>Atlas Workspace</h3><p>Product design · Collaboration</p></div><div>${img("second")}<h3>Fieldnotes</h3><p>Web design · Independent publishing</p></div></div></div><div class="web-about"><div><h2>Built around people.</h2><span>Our approach ↗</span></div><div><p>We design useful digital experiences around real tasks, clear language and the people who use them.</p><p>From the first conversation to the smallest detail, every decision belongs to a larger idea.</p></div></div><div class="enquiry"><h2>Tell us what you have in mind.</h2><div class="form-row"><div class="field">Your name</div><div class="field">Email address</div></div><div class="field">A little about your project</div><p>Start a conversation ↗</p></div><div class="web-footer"><span>Northstar — Digital product studio</span><span>Privacy · Instagram</span></div></div>`;
const full = (width = 360, scale = 0.36, regions = false) =>
  `<div class="full-page" style="width:${width}px;height:${1590 * scale}px">${site().replace('class="website"', `class="website" style="transform:scale(${scale})"`)}${regions ? `<div class="region" style="top:10px;height:220px"></div><div class="scan-label" style="top:15px">Intro · Candidate 1</div><div class="region" style="top:260px;height:150px"></div><div class="scan-label" style="top:265px">Work · Candidate 2</div><div class="region" style="top:480px;height:100px"></div><div class="scan-label" style="top:485px">Contact · Candidate 3</div>` : ""}</div>`;
const phone = () =>
  `<div><div class="phone-outline"><div class="phone-top">9:41 <span style="float:right">•••</span></div><div class="phone-hero"><span class="northstar" style="font-size:19px">Northstar</span><h2 style="margin-top:20px">Ideas into products.</h2><p>Digital products, thoughtfully put together.</p><div class="web-btn">Explore our work ↗</div></div>${img()}<div class="phone-small">Selected work<p>Atlas Workspace<br>Product design · Collaboration</p></div><div class="phone-dark">Start a conversation ↗</div></div><p class="hint" style="text-align:center">Phone · 390 × 844</p></div>`;
const panel = (title, body, width, meta = "") =>
  `<section class="panel" style="${width ? `width:${width}px;flex-shrink:0` : "flex:1"}"><header class="panel-head">${title}<span>${meta}</span></header>${body}</section>`;
const side = (body, width = 366) =>
  panel("Review details", `<div class="pad">${body}</div>`, width, "Northstar");
const cta = (text) =>
  `<div class="primary-row"><div class="button">${text}</div></div>`;
const tiny = () =>
  `<div class="rail"><p class="active">Overview</p><p>Intro</p><p>Selected work</p><p>Studio</p><p>Contact</p><div style="padding:20px 4px">${full(134, 0.134)}</div><p class="hint">Full-page context</p></div>`;
const layouts = {
  connect: () =>
    panel(
      "Connect your website",
      `<div class="pad"><h1>Start with your website.</h1><p>Bring the page, its repository and the task you want to review.</p><label>Website URL</label><div class="input">http://localhost:4321/</div><label>Local repository</label><div class="input source">~/Projects/northstar</div><div class="hint">Source access is confirmed locally.</div><label>Review task</label><div class="input">Explore projects and send an enquiry</div><label>Design sources</label><div class="input source">DESIGN.md<br>src/styles/tokens.css<br>src/components/</div>${cta("Confirm & start analysis")}<p class="hint" style="margin-top:16px">Capture scope is reviewed before execution.</p></div>`,
      390,
    ) +
    panel(
      "Website preview",
      `<div class="overview"><div class="page-outline"><div class="outline-caption"><span>Desktop · Complete page</span><span>1280 px</span></div>${full(360, 0.36)}</div>${phone()}</div>`,
      null,
      "Northstar · Demo project",
    ),
  analysis: () =>
    panel(
      "Full-page coverage",
      `<div class="overview" style="padding:15px">${full(370, 0.37, true)}</div>`,
      402,
      "Desktop",
    ) +
    panel(
      "Inspecting the page",
      `<div class="focus-surface">${contactPreview()}</div>`,
      null,
      "Contact region",
    ) +
    side(
      `<h2>Follow the analysis.</h2><p>Layout, content hierarchy, spacing and declared interactions.</p><div class="progress-track"><span></span></div><div class="row"><span>Desktop full page</span><strong>Captured</strong></div><div class="row"><span>Phone full page</span><strong>Captured</strong></div><div class="row"><span>Component sources</span><strong>Inventoried</strong></div><div class="row"><span>Enquiry entry state</span><strong>Reviewing</strong></div><h3>Candidate issues</h3><div class="finding"><strong>Intro action spacing</strong><p>Check the gap against the project token.</p></div><div class="finding"><strong>Project link labels</strong><p>Check source and rendered context.</p></div><div class="finding"><strong>Contact field labels</strong><p>Inspect labels in the enquiry state.</p></div><div class="hint">Illustrative capture plan · Unseen routes remain unverified.</div>`,
      350,
    ),
  findings: () =>
    tiny() +
    panel(
      "Candidate 1 · Intro action spacing",
      `<div class="focus-surface">${preview(false, true)}</div>`,
      null,
      "Desktop · Default",
    ) +
    side(
      `<div class="candidate"><span class="tag amber">Needs confirmation</span><span class="eyebrow">1 of 3 candidates</span></div><h2>The action sits too close.</h2><p>The introduction uses a 16 px gap. The supplied design source defines 32 px for this relationship.</p><div class="finding selected"><strong>Intro → supporting copy → action</strong><p>Observed: 16 px<br>Proposed: 32 px</p></div><h3>Inspect the evidence</h3><div class="task-file source">before/desktop-default.png</div><div class="task-file source">src/components/Intro.tsx</div><div class="task-file source">DESIGN.md · Intro spacing</div><p class="side-note">A difference is a candidate, not an automatic defect. Confirm the intended rule first.</p>${cta("Review design sources")}<div class="hint">2 other candidates stay outside this change.</div>`,
      380,
    ),
  foundation: () =>
    panel(
      "Keep the page in context",
      `<div class="overview">${full(350, 0.35)}</div>`,
      392,
      "Complete page",
    ) +
    panel(
      "Design system",
      `<div class="pad"><div class="breadcrumb">Northstar / Foundation / Typography & spacing</div><h2>Read the rules behind the page.</h2><div class="type-sample">Ideas into products.</div><p>Instrument Serif · Display</p><div style="font-size:24px;margin:24px 0 8px">Digital products, thoughtfully put together.</div><p>Instrument Sans · Body & controls</p><div class="token-grid"><div><div class="swatch" style="background:#ffffff"></div><span>Canvas · #FFFFFF</span></div><div><div class="swatch" style="background:#303328"></div><span>Ink · #303328</span></div></div><div class="token-line"><code>space.4</code><span>16 px</span></div><div class="token-line"><code>space.8</code><span>32 px</span></div><div class="token-line"><code>radius.control</code><span>4 px</span></div></div>`,
      null,
      "Source-backed inventory",
    ) +
    side(
      `<span class="tag amber">Awaiting approval</span><h2 style="margin-top:20px">Foundation v1</h2><p>Proposed constraints, linked to their project sources.</p><div class="row"><strong>Design guidance</strong></div><div class="task-file source">DESIGN.md<br><span class="muted">Intro / copy-to-action: 32 px</span></div><div class="row"><strong>Style tokens</strong></div><div class="task-file source">src/styles/tokens.css<br><span class="muted">--space-8: 32px;</span></div><div class="row"><strong>Component source</strong></div><div class="task-file source">src/components/Intro.tsx</div>${cta("Approve selected constraints")}<p class="hint" style="margin-top:18px">Approval defines constraints. It does not start a code change.</p>`,
      370,
    ),
  components: () =>
    tiny() +
    panel(
      "Component anatomy",
      `<div class="pad"><div class="breadcrumb">Intro → ActionLink</div><h2>A page becomes reusable parts.</h2><p>Trace the visible control to its source, states and consumers.</p><div class="component-demo"><div class="web-btn">Explore our work <span>↗</span></div><div class="anatomy"><span>Label</span><span>Spacing</span><span>Icon</span></div></div><h3>Declared states</h3><div style="display:flex;gap:20px;align-items:center;padding:20px 0"><div class="web-btn">Default ↗</div><div class="web-btn" style="background:#464b3d">Hover ↗</div><div class="web-btn" style="outline:2px solid #8c9c77;outline-offset:4px">Focus ↗</div></div><p class="side-note">Source-declared states are inspection targets; they are not proof of replay.</p><h3>Related page components</h3><div class="row"><span>SiteNav</span><span class="muted">Navigation</span></div><div class="row"><span>ProjectCard</span><span class="muted">Selected work</span></div><div class="row"><span>EnquiryForm</span><span class="muted">Contact</span></div></div>`,
      null,
      "Existing component",
    ) +
    side(
      `<h2>ActionLink</h2><div class="task-file source">src/components/ActionLink.tsx</div><h3>Inputs</h3><div class="source">label: string<br>href: string<br>icon?: ReactNode</div><h3>Observed consumers</h3><div class="row"><span>Intro.tsx</span><span>Primary action</span></div><div class="row"><span>Studio.tsx</span><span>Studio link</span></div><h3>Reuse decision</h3><p>Keep the shared control. Adjust only its parent layout in Intro.</p><div class="covered">No duplicate component needed.</div><p class="hint" style="margin-top:18px">Component inventory is partial until its sources and actual use are checked.</p>`,
      385,
    ),
  scope: () =>
    panel(
      "Proposed adjustment",
      `<div class="focus-surface">${preview(true, true)}</div>`,
      null,
      "Preview · Not applied",
    ) +
    side(
      `<span class="tag">Foundation v1 · Approved in this concept</span><h2 style="margin-top:20px">See exactly what changes.</h2><div class="change"><span class="old">16 px</span><span>→</span><span class="new">32 px</span></div><div class="task-file source">Intro.tsx → copy-to-action gap<br>--space-4 → --space-8</div><h3>Included in this change</h3><ul class="checklist"><li>Intro layout spacing</li><li>Desktop and phone verification</li></ul><h3>Keep as-is</h3><p>Wording, imagery, navigation and the shared ActionLink component.</p><div class="review-note">Confirm candidate 1 and this scope before the configured coding agent runs.</div>${cta("Confirm scope & prepare change")}<p class="hint" style="margin-top:18px">Other findings remain open.</p>`,
      428,
    ),
  execute: () =>
    `<div class="rail"><p class="active">Source changes</p><p>Intro.tsx</p><p>Managed preview</p><p>Run record</p><div class="button" style="margin:16px 4px;font-size:14px">Run change</div><div class="hint" style="padding:0 5px">Confirmed scope · Configured agent</div><div class="repo-note">Northstar<br><span class="source">Isolated copy</span></div></div>` +
    `<section class="code" style="width:626px;flex-shrink:0"><header class="panel-head">src/components/Intro.tsx<span>Proposed diff</span></header><pre><span class="line">12</span>export function Intro() {
<span class="line">13</span>  return (
<span class="line">14</span>    &lt;section&gt;
<span class="line">15</span>      &lt;h1&gt;Ideas into products.&lt;/h1&gt;
<span class="line">16</span>      &lt;div style={{
<span class="line">17</span>        display: 'flex',
<span class="line">18</span>        flexDirection: 'column',
<span class="remove">−       gap: 'var(--space-4)',</span><span class="add">+       gap: 'var(--space-8)',</span><span class="line">20</span>      }}&gt;
<span class="line">21</span>        &lt;p&gt;Digital products,
<span class="line">22</span>          thoughtfully put together.&lt;/p&gt;
<span class="line">23</span>        &lt;ActionLink
<span class="line">24</span>          href="#work"
<span class="line">25</span>          label="Explore our work"
<span class="line">26</span>        /&gt;
<span class="line">27</span>      &lt;/div&gt;
<span class="line">28</span>    &lt;/section&gt;
<span class="line">29</span>  );
<span class="line">30</span>}</pre></section>` +
    panel(
      "Managed preview",
      `<div class="focus-surface" style="padding:18px;display:block">${preview(true, true)}<div class="repo-note"><strong>Source-linked change</strong><br><span class="source">Northstar / src/components/Intro.tsx</span><br>Configured agent · Isolated Git worktree<br>No automatic push, merge or deployment.</div></div>`,
      null,
      "Concept after-state",
    ),
  compare: () =>
    panel(
      "Compare the same page state",
      `<div style="padding:18px;background:#e9ece5;height:calc(100% - 48px)"><div class="diff-view"><div class="web-preview"><div class="diff-label"><strong>Before</strong><span>Gap · 16 px</span></div>${nav()}${intro(false, true)}${img("preview-image")}<div class="mini-section"><h3>Selected work</h3><p>Same content, imagery and navigation.</p></div></div><div class="web-preview"><div class="diff-label"><strong>After</strong><span>Gap · 32 px</span></div>${nav()}${intro(true, true)}${img("preview-image")}<div class="mini-section"><h3>Selected work</h3><p>Same content, imagery and navigation.</p></div></div></div><div class="repo-note" style="margin-top:16px">Matched capture plan: Desktop 1280 × 800 · Phone 390 × 844 · Intro action + page context</div></div>`,
      null,
      "Desktop · Default",
    ) +
    side(
      `<h2>Review the difference.</h2><div class="row"><span>Selected change</span><strong>Intro spacing</strong></div><div class="row"><span>Code change</span><strong>1 source file</strong></div><div class="row"><span>Other candidates</span><strong>2 still open</strong></div><h3>Independent review</h3><div class="review-note">Read matching captures and interaction evidence before deciding. No real Northstar QA verdict is claimed.</div><h3>Human decision</h3><div style="display:flex;gap:10px"><div class="button secondary">Request revision</div><div class="button">Accept</div></div><div class="hint" style="margin-top:16px">Awaiting your decision.</div><h3>Same run, full context</h3><p class="side-note">Source → evidence → change → review</p><div class="task-file source">run / northstar-demo<br>View the same record ↗</div><img class="inline-wordmark" src="${logo}" alt="HappyHands">`,
      360,
    ),
};
// Only allow declared scene IDs; all displayed content is authored static concept data.
document.getElementById("composition").innerHTML =
  `<header class="shell"><img class="logo" src="${logo}" alt="HappyHands"><span class="divider"></span><span class="project">Northstar</span><span class="muted">/ ${scene.title}</span><span class="right">Storyboard concept · Local workflow</span></header><div class="body">${layouts[scene.id]()}</div><footer class="bottom"><strong>${scene.caption}</strong><span>Illustrative UI · Fictional project · Not a live execution</span></footer>`;
document.body.dataset.scene = scene.id;
document.title = `${scene.title} — HappyHands V6`;
