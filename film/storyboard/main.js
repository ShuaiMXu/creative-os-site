import { storyboard, timing, timecode } from "./scenes.js";
const $ = (id) => document.getElementById(id);
const nav = $("scene-nav");
for (const s of timing) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.scene = s.id;
  const time = document.createElement("small");
  time.textContent = `${timecode(s.start)}–${timecode(s.start + s.seconds)}`;
  const title = document.createElement("strong");
  title.textContent = s.title;
  button.append(time, title);
  button.addEventListener("click", () => {
    location.hash = s.id;
  });
  nav.append(button);
}
let selected = 0;
function render() {
  const id = location.hash.slice(1);
  selected = Math.max(
    0,
    timing.findIndex((s) => s.id === id),
  );
  const s = timing[selected];
  document.title = `${s.title} — HappyHands storyboard ${storyboard.version}`;
  $("scene-time").textContent =
    `Scene ${selected + 1} of ${timing.length} · ${timecode(s.start)}–${timecode(s.start + s.seconds)} · ${s.seconds} seconds`;
  $("scene-title").textContent = s.title;
  $("plate").src = `/film/storyboard/plates/${s.plate}`;
  $("plate").alt = s.alt;
  $("caption").textContent = s.caption;
  $("frame").classList.toggle("dark", s.tone === "dark");
  $("frame").classList.toggle("closing", Boolean(s.closing));
  $("closing-copy").hidden = !s.closing;
  $("film-logo").src =
    `/brand/happyhands-logo-${s.tone === "dark" ? "paper" : "ink"}.png`;
  for (const k of [
    "action",
    "camera",
    "transition",
    "voiceover",
    "capability",
    "boundary",
  ])
    $(k).textContent = s[k];
  $("source").href =
    `https://github.com/ShuaiMXu/creative-os/blob/8b1541a9488b9413f98096f8547163f7c261acda/${s.source}`;
  $("previous").disabled = selected === 0;
  $("next").disabled = selected === timing.length - 1;
  for (const b of nav.querySelectorAll("button")) {
    if (b.dataset.scene === s.id) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
  }
}
$("previous").addEventListener("click", () => {
  if (selected > 0) location.hash = timing[selected - 1].id;
});
$("next").addEventListener("click", () => {
  if (selected < timing.length - 1) location.hash = timing[selected + 1].id;
});
window.addEventListener("hashchange", render);
render();
