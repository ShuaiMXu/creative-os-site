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
// Only authored scene IDs are selected. This route never runs product actions.
const { compose } = await import("./composition-v7.js");
document.getElementById("composition").innerHTML = compose(scene, {
  full,
  preview,
  contactPreview,
  phone,
  logo,
});
document.body.dataset.scene = scene.id;
document.title = `${scene.title} — HappyHands V7`;
