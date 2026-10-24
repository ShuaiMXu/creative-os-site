import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const browserExecutable =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.tsx"),
  publicDir: path.resolve("public"),
});
const composition = await selectComposition({
  serveUrl,
  id: "HappyHandsC",
  browserExecutable,
});
await mkdir("out/stills-v3", { recursive: true });
for (const frame of [
  0, 80, 174, 195, 214, 240, 275, 330, 410, 462, 540, 666, 780,
]) {
  await renderStill({
    serveUrl,
    composition,
    browserExecutable,
    frame,
    output: `out/stills-v3/f${frame}.png`,
    imageFormat: "png",
  });
  console.log("Still", frame);
}
await writeFile(
  "out/stills-v3/composition.json",
  JSON.stringify({
    width: composition.width,
    height: composition.height,
    fps: composition.fps,
    durationInFrames: composition.durationInFrames,
  }),
);
