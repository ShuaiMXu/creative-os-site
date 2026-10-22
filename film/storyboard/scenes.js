export const storyboard = {
  version: "V7",
  duration: 85,
  title: "See the page. Understand the change.",
  status: "Static storyboard for approval. No video production has started.",
  scenes: [
    {
      id: "connect",
      seconds: 8,
      title: "Connect the website",
      caption: "Start with your website.",
      plate: "v7/01-connect.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: connect the website, with the Northstar page and its source context.",
      action:
        "Enter the page URL, confirm local repository access and supply design sources. Show the complete Northstar page beside the connection form, plus its phone view.",
      camera:
        "An enlarged URL control resolves into a full-page object, its source bundle and a phone view. Keep the neutral stage fixed.",
      transition:
        "The page stays fixed as the analysis panel replaces the form.",
      voiceover:
        "Start with your website. Connect its repository and design sources, then confirm what the local workbench should review.",
      capability: "Website handoff and local onboarding",
      source: "docs/site-workbench-handoff.md",
      boundary:
        "A URL supports capture; source extraction and editing require a connected local repository. This concept is not a new hosted URL-only service.",
    },
    {
      id: "analysis",
      seconds: 12,
      title: "Analyze the whole page",
      caption: "See the whole experience.",
      plate: "v7/02-analysis.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: analyze the whole page, with the Northstar page and its source context.",
      action:
        "Show the full-page overview from navigation through contact. Surface desktop and phone capture coverage and the declared enquiry interaction being reviewed.",
      camera:
        "Track the scan across the complete page. A source-connected crop expands into the contact region and its evidence note.",
      transition:
        "An analysis candidate anchors the next zoom to the Intro region.",
      voiceover:
        "Follow the page from top to bottom. Review layout, content hierarchy, spacing and planned interactions, with the checked scope always visible.",
      capability: "Whole-page, regional and planned-state capture",
      source: "docs/harness.md",
      boundary:
        "Coverage and progress are illustrative. Capture covers declared routes and states; unseen routes and interactions are not certified.",
    },
    {
      id: "findings",
      seconds: 10,
      title: "Inspect a specific finding",
      caption: "Find what needs attention.",
      plate: "v7/03-findings.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: inspect a specific finding, with the Northstar page and its source context.",
      action:
        "Select candidate 1. Highlight the copy-to-action relationship and show its screenshot, component source and design guidance. Keep the full-page navigator visible.",
      camera:
        "Move closer to the selected component without losing the page locator. Hold the observed 16 px value next to the proposed rule.",
      transition: "Follow the source reference into the design-system view.",
      voiceover:
        "Open a candidate and see where it occurs, what was observed and which source supports the proposed change. Confirm the intent before treating it as a defect.",
      capability: "Evidence-linked diagnosis and candidate confirmation",
      source: "docs/harness.md",
      boundary:
        "The example has three authored candidates. These are not actual scan results; neither the design value nor the defect is automatically validated.",
    },
    {
      id: "foundation",
      seconds: 12,
      title: "Read the design system",
      caption: "Understand your design system.",
      plate: "v7/04-foundation.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: read the design system, with the Northstar page and its source context.",
      action:
        "Show type, colors and spacing alongside the complete page and actual named source paths. Review selected Foundation constraints before approving them.",
      camera:
        "Pull type and spacing out of the page into connected specimens. Set 32 px at data scale, then anchor it back to the source.",
      transition:
        "Carry the selected component reference into its anatomy and consumers.",
      voiceover:
        "Read the design language behind the page. Compare observed styles with DESIGN.md and tokens, then approve the constraints that should guide the work.",
      capability: "Source-backed design inventory and Foundation approval",
      source: "docs/reusable-design-system-extraction.md",
      boundary:
        "The inventory is illustrative and can be partial in real runs. Approving Foundation constraints does not authorize editing.",
    },
    {
      id: "components",
      seconds: 10,
      title: "Inspect component anatomy",
      caption: "Break it down into components.",
      plate: "v7/05-components.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: inspect component anatomy, with the Northstar page and its source context.",
      action:
        "Locate ActionLink inside Intro. Show its label, icon, declared states and two illustrative consumers. Keep the existing shared control and change its parent spacing only.",
      camera:
        "Lift the selected control from the page into an exploded-view composition. Separate its label, spacing and icon; reveal states and consumers.",
      transition:
        "Return to the parent layout with the proposed spacing adjustment highlighted.",
      voiceover:
        "Trace controls to their components, inputs and consumers. Reuse the shared parts where they fit; change only the layout that needs attention.",
      capability: "Component inventory and reuse planning",
      source: "docs/reusable-design-system-extraction.md",
      boundary:
        "Code declarations and static state examples are not replay evidence. Automatic extraction into new components is not claimed; the reuse decision is scoped.",
    },
    {
      id: "scope",
      seconds: 11,
      title: "Preview the exact adjustment",
      caption: "See exactly what will change.",
      plate: "v7/06-scope.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: preview the exact adjustment, with the Northstar page and its source context.",
      action:
        "Display the proposed 32 px spacing on the same Intro, with 16 → 32 px and the token reference. Explicitly retain wording, imagery, navigation and ActionLink. Confirm the candidate and scope.",
      camera:
        "Make 16 to 32 px the leading visual. Slide the exact source token into the page crop, keeping one bounded scope confirmation.",
      transition: "The approved token change match-cuts into the source diff.",
      voiceover:
        "Preview the adjustment before code changes. Confirm the spacing, the source token and the boundaries: keep the content, imagery, navigation and shared control.",
      capability: "Scoped planning and explicit change confirmation",
      source: "docs/harness.md",
      boundary:
        "The frame shows a proposal, not an applied change. The other two candidates remain open; approving one issue does not accept the full page.",
    },
    {
      id: "execute",
      seconds: 12,
      title: "Apply the confirmed change",
      caption: "Turn the decision into code.",
      plate: "v7/07-execute.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: apply the confirmed change, with the Northstar page and its source context.",
      action:
        "Show the configured agent stage, isolated Git copy, Intro.tsx diff and source-linked managed preview. Change --space-4 to --space-8 in the parent layout.",
      camera:
        "Follow the source diff across a shallow change of plane into the page result. Preserve the source path and execution boundary.",
      transition:
        "Lock the preview state and split it into matched before and after evidence.",
      voiceover:
        "Run the confirmed change with the configured coding agent in an isolated copy. Inspect the exact source diff and the matching managed preview.",
      capability: "Coding-agent execution, isolated worktrees and preview",
      source: "docs/harness.md",
      boundary:
        "Static sample diff, not a real Northstar agent execution. Local setup is required. No automatic push, PR, merge or deployment is promised.",
    },
    {
      id: "compare",
      seconds: 10,
      title: "Compare and keep the record",
      caption: "Review the difference.",
      plate: "v7/08-compare.png",
      tone: "light",
      composed: true,
      alt: "Art-directed HappyHands storyboard: compare and keep the record, with the Northstar page and its source context.",
      action:
        "Compare the same rendered Intro state at the same scale. Show 16 px before and 32 px after, the planned desktop/phone checks, independent review boundary and pending human decision. Retain the same run record.",
      camera:
        "Use equal-scale before/after surfaces and a fixed comparison seam. The evidence condenses into a human-decision strip.",
      transition:
        "End with the real HappyHands logo in the same workflow context, not a separate promotional card.",
      voiceover:
        "Compare matching page states and inspect independent review. Accept the change or request revision, with source, evidence and decisions kept in the same record.",
      capability:
        "Matched before/after evidence, independent review and human judgment",
      source: "docs/harness.md",
      boundary:
        "These are concept comparisons with no actual QA verdict or acceptance. The two other authored candidates remain open; a local change is not whole-site certification.",
    },
  ],
};
export const timing = storyboard.scenes.map((scene, index) => ({
  ...scene,
  index,
  start: storyboard.scenes
    .slice(0, index)
    .reduce((sum, s) => sum + s.seconds, 0),
}));
export const timecode = (value) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
