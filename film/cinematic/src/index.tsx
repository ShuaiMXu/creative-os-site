import React from "react";
import { Composition, registerRoot } from "remotion";
import { Film } from "./Film";
import { TOTAL } from "./timeline";
const Root: React.FC = () => (
  <Composition
    id="HappyHandsC"
    component={Film}
    durationInFrames={TOTAL}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ blur: true }}
  />
);
registerRoot(Root);
