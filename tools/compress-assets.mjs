// Compress the crawled placeholder imagery in place. The whirl's largest
// tile renders at ~190px (2x ≈ 380px) and the catalog tiles are smaller, so
// long-edge caps far below the originals are visually lossless here.
// Idempotent: skips files already under the cap.
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const JOBS = [
  { dir: '../public/assets/hero/', maxEdge: 900, quality: 72 },
  { dir: '../public/assets/browse/', maxEdge: 700, quality: 72 }
];

for (const job of JOBS) {
  const dir = fileURLToPath(new URL(job.dir, import.meta.url));
  const files = readdirSync(dir).filter(f => /\.(webp|jpe?g|png)$/i.test(f));
  let saved = 0;
  for (const file of files) {
    const path = dir + file;
    const before = statSync(path).size;
    // Feed sharp a buffer, not the path: libvips memory-maps file inputs and
    // keeps the mapping past the call, which makes the in-place replace below
    // fail with EBUSY on Windows.
    const { readFileSync } = await import('node:fs');
    const image = sharp(readFileSync(path));
    const meta = await image.metadata();
    const needs = Math.max(meta.width || 0, meta.height || 0) > job.maxEdge;
    if (!needs) continue;
    const buffer = await image
      .resize({ width: meta.width >= meta.height ? job.maxEdge : undefined, height: meta.height > meta.width ? job.maxEdge : undefined })
      .webp({ quality: job.quality })
      .toBuffer();
    if (buffer.length < before) {
      const { writeFileSync, rmSync, renameSync } = await import('node:fs');
      const temporary = path + '.tmp';
      writeFileSync(temporary, buffer);
      // Windows + real-time AV scanning of freshly written files throws
      // EPERM/EBUSY on rename-over and unlink; retry with backoff.
      for (let attempt = 0; ; attempt++) {
        try {
          rmSync(path, { force: true });
          renameSync(temporary, path);
          break;
        } catch (error) {
          if (attempt >= 6) throw error;
          await new Promise(wait => setTimeout(wait, 250 * (attempt + 1)));
        }
      }
      saved += before - buffer.length;
    }
  }
  const total = files.reduce((sum, f) => sum + statSync(dir + f).size, 0);
  console.log(`${job.dir}: ${files.length} files, now ${(total / 1e6).toFixed(1)} MB (saved ${(saved / 1e6).toFixed(1)} MB)`);
}
