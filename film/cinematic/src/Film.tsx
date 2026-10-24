import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { CAPTIONS, CUES, SHOTS } from "./timeline";
import "./style.css";

const B = {
  paper: "#f7f7f8",
  ink: "#202020",
  muted: "#646464",
  blue: "#0d74ce",
  soft: "#e6f4fe",
};
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = Easing.bezier(0.35, 0, 0.2, 1);
const p = (f: number, a: number, b: number, fn = ease) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fn,
  });
// CardFlipReveal.tsx grammar: 18f to 192°, then 8f quintic settle to 180°.
export const flip = (f: number, start: number) =>
  f < start + 18
    ? 192 * p(f, start, start + 18, Easing.bezier(0.55, 0, 0.3, 1))
    : mix(192, 180, p(f, start + 18, start + 26, Easing.out(Easing.poly(5))));
type Camera = {
  f: number;
  cx: number;
  cy: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
};
export const CAM: Camera[] = [
  { f: 0, cx: 510, cy: 320, z: 1.26, rx: 8, ry: -19, rz: -3 },
  { f: 30, cx: 510, cy: 320, z: 1.26, rx: 8, ry: -19, rz: -3 },
  { f: 96, cx: 485, cy: 310, z: 1.48, rx: 2, ry: -9, rz: -1 },
  { f: 118, cx: 485, cy: 310, z: 1.48, rx: 2, ry: -9, rz: -1 },
  { f: 160, cx: 280, cy: 285, z: 2.6, rx: 0, ry: 0, rz: 0 },
  { f: 190, cx: 280, cy: 285, z: 2.6, rx: 0, ry: 0, rz: 0 },
  { f: 208, cx: 500, cy: 320, z: 1.2, rx: 0, ry: 0, rz: 0 },
  { f: 236, cx: 500, cy: 320, z: 1.2, rx: 0, ry: 0, rz: 0 },
  { f: 266, cx: 380, cy: 320, z: 2.2, rx: 0, ry: 0, rz: 0 },
  { f: 335, cx: 380, cy: 320, z: 2.2, rx: 0, ry: 0, rz: 0 },
  { f: 388, cx: 500, cy: 320, z: 1.2, rx: 0, ry: 0, rz: 0 },
  { f: 426, cx: 500, cy: 320, z: 1.2, rx: 0, ry: 0, rz: 0 },
  { f: 462, cx: 280, cy: 285, z: 2.6, rx: 0, ry: 0, rz: 0 },
  { f: 616, cx: 280, cy: 285, z: 2.6, rx: 0, ry: 0, rz: 0 },
  { f: 656, cx: 500, cy: 320, z: 1.1, rx: 0, ry: -8, rz: 0 },
  { f: 712, cx: 500, cy: 320, z: 1.1, rx: 0, ry: -8, rz: 0 },
  { f: 746, cx: 500, cy: 80, z: 0.65, rx: 18, ry: -18, rz: -5 },
  { f: 840, cx: 500, cy: 80, z: 0.65, rx: 18, ry: -18, rz: -5 },
];
export function camera(f: number) {
  let i = 0;
  while (i < CAM.length - 2 && f > CAM[i + 1].f) i++;
  const a = CAM[i],
    b = CAM[i + 1],
    k = p(f, a.f, b.f);
  return {
    cx: mix(a.cx, b.cx, k),
    cy: mix(a.cy, b.cy, k),
    z: mix(a.z, b.z, k),
    rx: mix(a.rx, b.rx, k),
    ry: mix(a.ry, b.ry, k),
    rz: mix(a.rz, b.rz, k),
  };
}
const Texture: React.FC<{ state: "before" | "after"; hires?: number }> = ({
  state,
  hires = 1,
}) => (
  <>
    <Img
      src={staticFile(`textures/page-${state}-6x.png`)}
      style={{ position: "absolute", inset: 0, width: 1000, height: 640 }}
    />
    <Img
      src={staticFile(`textures/group-${state}-6x.png`)}
      style={{
        position: "absolute",
        left: 65,
        top: 232.890625,
        width: 870,
        height: state === "before" ? 106 : 122,
        opacity: hires,
      }}
    />
  </>
);
const Corners: React.FC<{ f: number }> = ({ f }) => {
  const k = p(
    f,
    SHOTS.inspect.from + 8,
    SHOTS.inspect.from + 26,
    Easing.out(Easing.back(1.7)),
  );
  const visible = p(f, 115, 125) * (1 - p(f, 199, 208));
  return (
    <div
      style={{
        position: "absolute",
        left: 53,
        top: 220.89,
        width: 588,
        height: 130,
        transform: `scale(${mix(1.75, 1, k)})`,
        opacity: visible,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 18,
            height: 18,
            borderColor: B.blue,
            borderStyle: "solid",
            borderWidth:
              i === 0
                ? "2px 0 0 2px"
                : i === 1
                  ? "2px 2px 0 0"
                  : i === 2
                    ? "0 2px 2px 0"
                    : "0 0 2px 2px",
            left: i === 0 || i === 3 ? 0 : undefined,
            right: i === 1 || i === 2 ? 0 : undefined,
            top: i < 2 ? 0 : undefined,
            bottom: i > 1 ? 0 : undefined,
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          left: 310,
          top: 58,
          fontSize: 18,
          color: B.muted,
          background: "white",
          padding: "0 7px",
        }}
      >
        DESIGN.md · Target 32 px
      </span>
      <span
        style={{
          position: "absolute",
          left: 310,
          top: 90,
          fontSize: 22,
          color: B.blue,
          background: "white",
          padding: "0 7px",
          whiteSpace: "nowrap",
        }}
      >
        {f >= 190 ? "Scope confirmed ✓" : "Confirm scope ↗"}
      </span>
    </div>
  );
};
const Source: React.FC<{ f: number }> = ({ f }) => {
  const change = p(
    f,
    SHOTS.edit.from + 18,
    SHOTS.edit.from + 36,
    Easing.out(Easing.poly(5)),
  );
  return (
    <div className="source">
      <div className="source-file">
        Intro.tsx <span> / </span> intro.css
      </div>
      <div className="source-scope">Confirmed scope · Intro spacing</div>
      <div className="code-block">
        <div className="code-comment">/* shared ActionLink preserved */</div>
        <div>.intro-actions {"{"}</div>
        <div className="gap-row">
          <span>gap: var(</span>
          <span className="token-window">
            <span style={{ transform: `translateY(${-change * 64}px)` }}>
              --space-4
              <br />
              <b>--space-8</b>
            </span>
          </span>
          <span>);</span>
        </div>
        <div>{"}"}</div>
      </div>
      <div className="rule">
        DESIGN.md <span>Target · 32 px</span>
      </div>
    </div>
  );
};
const Sheen: React.FC<{ angle: number }> = ({ angle }) => {
  const a = angle % 180,
    pos = interpolate(a, [35, 145], [-25, 115], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    op = Math.max(0, 1 - Math.abs(a - 90) / 55);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 12,
        overflow: "hidden",
        opacity: op,
        pointerEvents: "none",
        background: `linear-gradient(105deg,transparent ${pos - 14}%,rgba(0,0,0,.32) ${pos}%,transparent ${pos + 14}%)`,
      }}
    />
  );
};
export const PageWorld: React.FC = () => {
  const f = useCurrentFrame(),
    cam = camera(f),
    angle = flip(f, SHOTS.source.from) + flip(f, SHOTS.edit.from + 100);
  const changed = p(f, SHOTS.edit.from + 18, SHOTS.edit.from + 36);
  const compare = f >= SHOTS.compare.from && f < SHOTS.pending.from;
  const isolate = p(f, 440, 465) * (1 - p(f, 616, 644));
  const currentGap = compare
    ? 32 - 16 * p(f, 492, 510) + 16 * p(f, 540, 558)
    : 32;
  const gapVisible =
    p(f, SHOTS.inspect.from + 12, SHOTS.inspect.from + 28) *
    (1 - p(f, 199, 208));
  const hires = p(f, 120, 126);
  const fade = 1 - p(f, 716, 751);
  return (
    <AbsoluteFill style={{ background: B.paper, overflow: "hidden" }}>
      <div
        className="ground-shadow"
        style={{
          opacity: 0.18 * fade,
          transform: `translateX(${cam.ry * 2}px) scaleX(${cam.z})`,
        }}
      />
      <AbsoluteFill
        style={{
          perspective: 2400 * cam.z,
          perspectiveOrigin: "960px 540px",
          opacity: fade,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1000,
            height: 640,
            zoom: cam.z,
            transform: `translate(${960 / cam.z - cam.cx}px,${540 / cam.z - cam.cy}px) rotateY(${cam.ry}deg) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg)`,
            transformOrigin: `${cam.cx}px ${cam.cy}px`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotateY(${angle}deg)`,
              transformStyle: "preserve-3d",
              transformOrigin: "500px 320px",
            }}
          >
            <div className="page-face">
              <div
                style={{
                  filter: `blur(${isolate * 5}px)`,
                  opacity: 1 - isolate * 0.8,
                }}
              >
                <Texture
                  state={changed > 0.5 ? "after" : "before"}
                  hires={hires}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 65,
                  top: 264.89,
                  width: 285,
                  height: 16,
                  borderTop: "1px solid #0d74ce",
                  borderBottom: "1px solid #0d74ce",
                  background: "#0d74ce18",
                  opacity: gapVisible,
                }}
              />
              {isolate > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 52,
                    top: 207,
                    width: 625,
                    height: 174,
                    background: "white",
                    border: "1px solid #d9d9e0",
                    borderRadius: 4,
                    boxShadow: `0 ${8 * isolate}px ${30 * isolate}px #20202016`,
                    opacity: isolate,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: 24.89,
                      width: 604,
                      height: 138,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: currentGap,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 26,
                        lineHeight: "32px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Digital products, thoughtfully put together.
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 36,
                        fontSize: 24,
                        lineHeight: "26px",
                        padding: "16px 24px",
                        minWidth: 270,
                        borderRadius: 4,
                        background: B.ink,
                        color: "white",
                      }}
                    >
                      Explore our work <span>↗</span>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 12,
                      top: 56.89,
                      width: 285,
                      height: currentGap,
                      borderTop: "1px solid #0d74ce",
                      borderBottom: "1px solid #0d74ce",
                      background: "#0d74ce18",
                    }}
                  />
                  {compare && (
                    <div
                      style={{
                        position: "absolute",
                        left: 12,
                        top: -38,
                        display: "flex",
                        gap: 18,
                        fontSize: 19,
                      }}
                    >
                      {["Before", "After"].map((mode) => (
                        <span
                          key={mode}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 3,
                            background:
                              (mode === "Before") === (f >= 492 && f < 540)
                                ? B.soft
                                : "white",
                            color:
                              (mode === "Before") === (f >= 492 && f < 540)
                                ? B.blue
                                : B.muted,
                          }}
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      left: 325,
                      top: 75,
                      fontSize: 22,
                      lineHeight: 1.4,
                      color: B.blue,
                    }}
                  >
                    Gap · {Math.round(currentGap)} px
                  </span>
                </div>
              )}
              <Corners f={f} />
              <Sheen angle={angle} />
              <svg
                width="25"
                height="32"
                viewBox="0 0 30 37"
                style={{
                  position: "absolute",
                  left: mix(560, 463, p(f, 174, 188)),
                  top: mix(370, 323, p(f, 174, 188)),
                  opacity: p(f, 174, 182) * (1 - p(f, 194, 199)),
                  transform: `scale(${f >= 190 && f < 194 ? 0.85 : 1})`,
                }}
              >
                <path
                  d="M3 2 26 20 16 22 13 34Z"
                  fill="#202020"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="page-face source-face">
              <Source f={f} />
              <Sheen angle={angle} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div
        className="review-outside"
        style={{
          opacity:
            p(f, SHOTS.pending.from + 12, SHOTS.pending.from + 28) *
            (1 - p(f, 708, 720)),
        }}
      >
        <span>Independent review · Pending</span>
        <span>Your decision · Pending</span>
      </div>
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          left: 58,
          top: 40,
          width: 300,
          opacity: 1 - p(f, 95, 118),
        }}
      />
    </AbsoluteFill>
  );
};
export const Captions: React.FC<{ color?: string }> = ({ color = B.ink }) => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find((c) => f >= c.from && f < c.to);
  if (!c) return null;
  const k = p(f, c.from, c.from + 12),
    out = 1 - p(f, c.to - 10, c.to);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 215,
          background: "linear-gradient(transparent,#f7f7f8 78%)",
          opacity: k * out,
          zIndex: 9,
        }}
      />
      <div
        className="caption"
        style={{
          color,
          opacity: k * out,
          transform: `translateY(${(1 - k) * 20}px)`,
        }}
      >
        {c.text}
      </div>
    </>
  );
};
export const Brand: React.FC<{ text?: string; url?: string }> = ({
  text = "Review. Change. Verify.",
  url = "happyhands.cc",
}) => {
  const f = useCurrentFrame(),
    k = p(
      f,
      SHOTS.brand.from + 8,
      SHOTS.brand.from + 28,
      Easing.out(Easing.poly(5)),
    );
  return (
    <AbsoluteFill
      className="brand"
      style={{ opacity: k, transform: `translateY(${(1 - k) * 48}px)` }}
    >
      <Img src={staticFile("logo.png")} style={{ width: 570 }} />
      <div>{text}</div>
      <p>{url}</p>
    </AbsoluteFill>
  );
};
export const Provenance: React.FC = () => (
  <div className="provenance">Fictional Northstar · Illustrative workflow</div>
);
export const Film: React.FC<{ blur?: boolean }> = ({ blur = true }) => (
  <AbsoluteFill>
    {blur ? (
      <CameraMotionBlur shutterAngle={180} samples={7}>
        <PageWorld />
      </CameraMotionBlur>
    ) : (
      <PageWorld />
    )}
    <Captions />
    <Brand />
    <Provenance />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.duration}>
        <Audio src={staticFile(c.src)} volume={c.volume} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
