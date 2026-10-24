export const FPS = 30;
export const SHOTS = {
  page: { from: 0, duration: 120 },
  inspect: { from: 120, duration: 90 },
  source: { from: 210, duration: 90 },
  edit: { from: 300, duration: 180 },
  compare: { from: 480, duration: 150 },
  pending: { from: 630, duration: 90 },
  brand: { from: 720, duration: 120 },
} as const;
export const TOTAL = 840;
export const CAPTIONS = [
  { from: 16, to: 112, text: "Review the whole experience." },
  { from: 130, to: 198, text: "Confirm one change." },
  { from: 224, to: 292, text: "Follow it into the source." },
  { from: 312, to: 372, text: "One scoped edit." },
  { from: 498, to: 612, text: "Check the result." },
];
export const CUES = [
  {
    from: SHOTS.inspect.from + 70,
    duration: 20,
    src: "audio/click.mp3",
    volume: 0.22,
    label: "Scope confirmed",
  },
  {
    from: SHOTS.source.from,
    duration: 34,
    src: "audio/page-turn.mp3",
    volume: 0.35,
    label: "Page turns to source",
  },
  {
    from: SHOTS.edit.from + 18,
    duration: 20,
    src: "audio/click.mp3",
    volume: 0.28,
    label: "Spacing token changes",
  },
  {
    from: SHOTS.edit.from + 100,
    duration: 34,
    src: "audio/page-turn.mp3",
    volume: 0.3,
    label: "Same page returns",
  },
  {
    from: SHOTS.brand.from,
    duration: 70,
    src: "audio/resolve.mp3",
    volume: 0.2,
    label: "Brand resolution",
  },
];
