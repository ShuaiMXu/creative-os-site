export const storyboard = {
  version: "V5",
  duration: 80,
  title: "Make it feel designed.",
  status: "Storyboard for approval. Video production has not started.",
  scenes: [
    {
      id: "opening",
      seconds: 6,
      title: "A working product",
      caption: "Your app works. Make it feel designed.",
      plate: "01-opening.webp",
      tone: "light",
      alt: "The fictional Northstar architecture website on desktop and phone, framed in warm daylight.",
      action:
        "Establish Northstar as the sample project. Move from its complete page toward the area that needs a closer look.",
      camera:
        "A slow oblique push through the website plane; keep the architecture and type readable.",
      transition:
        "The website edge becomes the boundary of the project connection pane.",
      voiceover:
        "Your product works. HappyHands helps you take the next step: a more considered experience.",
      capability: "Review an existing product",
      source: "README.md",
      boundary:
        "Northstar is a fictional target project, not the HappyHands interface or a customer result.",
    },
    {
      id: "connect",
      seconds: 10,
      title: "Connect the real project",
      caption: "Start with your project.",
      plate: "02-connect.webp",
      tone: "light",
      alt: "A website connection form hands Northstar and its design source paths into a local confirmation panel.",
      action:
        "Carry the project, user task and design-source paths from the website to local confirmation.",
      camera:
        "Track the cursor between the two panes, then move into the local workbench.",
      transition:
        "A confirmed local connection resolves into the first captured page.",
      voiceover:
        "Connect your repository and task. Bring your design sources, then confirm the project and capture scope locally.",
      capability: "Website-to-local project handoff",
      source: "docs/site-workbench-handoff.md",
      boundary:
        "The public website does not read source or execute agents. Local setup and confirmation are required.",
    },
    {
      id: "review",
      seconds: 12,
      title: "Review the experience",
      caption: "A closer look.",
      plate: "03-review.webp",
      tone: "light",
      alt: "A copper spacing marker links the Northstar page to a compact evidence-inspection note; a phone view remains behind it.",
      action:
        "Inspect normal desktop and phone captures, whole-page regions and explicitly planned interactions. Open the original image behind a candidate.",
      camera:
        "Push into one spacing relationship, then reveal its attached review note.",
      transition:
        "Hold the copper selection while the component separates from the page.",
      voiceover:
        "Review captured pages and planned interactions. Follow each candidate back to its evidence, and decide which problem is worth addressing.",
      capability: "Captured evidence and screenshot-aware diagnosis",
      source: "docs/harness.md",
      boundary:
        "A candidate is not a confirmed defect. Uncaptured routes and states remain unverified; pixel labels here are illustrative.",
    },
    {
      id: "foundation",
      seconds: 12,
      title: "Use the project’s design language",
      caption: "Your language, made explicit.",
      plate: "04-foundation.webp",
      tone: "light",
      alt: "A selected Northstar component is connected to a type specimen, token source and a Foundation awaiting approval.",
      action:
        "Connect existing DESIGN.md, style tokens and component sources to observed rules. Review selected constraints before approving a version.",
      camera:
        "Track from the component to its source, then settle on the explicit Foundation approval.",
      transition:
        "The selected rule stays anchored as it becomes part of the confirmed brief.",
      voiceover:
        "Trace typography, spacing and components to their sources. Review the proposed rules and approve the design constraints you want the change to follow.",
      capability: "Source-backed inventory and versioned Foundation approval",
      source: "docs/reusable-design-system-extraction.md",
      boundary:
        "Inventory can be partial. This is not automatic design-system certification; approval remains a human action.",
    },
    {
      id: "scope",
      seconds: 10,
      title: "Confirm one bounded change",
      caption: "Choose what changes.",
      plate: "05-scope.webp",
      tone: "light",
      alt: "A focused scope confirmation for the spacing change sits over the selected Northstar component.",
      action:
        "Confirm the specific spacing adjustment. Keep wording, imagery and navigation outside the change.",
      camera:
        "Hold on the proposed boundary; let the cursor approach Confirm scope without skipping the decision.",
      transition:
        "The selected spacing value match-cuts into the isolated code diff.",
      voiceover:
        "Choose a supported issue and confirm its boundaries. Keep the content and navigation that already work, and approve only the intended adjustment.",
      capability: "Evidence confirmation and scope-bound planning",
      source: "docs/harness.md",
      boundary:
        "No unconfirmed direction is added to the brief. An approved Foundation does not itself authorize an edit.",
    },
    {
      id: "execute",
      seconds: 12,
      title: "Turn the decision into code",
      caption: "A scoped change. A traceable diff.",
      plate: "06-execute.webp",
      tone: "dark",
      alt: "An isolated working-copy code diff adjusts the sample spacing, with the Northstar preview behind it.",
      action:
        "Pass the confirmed brief to the configured coding agent. Inspect the isolated working-copy diff and managed preview.",
      camera: "Follow the highlighted source line into the rendered component.",
      transition:
        "The copper diff marker becomes the before/after comparison seam.",
      voiceover:
        "The coding agent works in an isolated copy. Inspect the relevant code changes and preview the result against the approved scope.",
      capability: "Coding-agent adapters, isolated worktrees and preview",
      source: "docs/harness.md",
      boundary:
        "Sample code is illustrative. The shipped adapters are Codex CLI and Claude Code CLI; this is not automatic push, merge or deployment.",
    },
    {
      id: "compare",
      seconds: 12,
      title: "Compare, review and decide",
      caption: "Compare. Review. Decide.",
      plate: "07-compare.webp",
      tone: "dark",
      alt: "A single Northstar comparison surface leads to an independent-review strip awaiting a human decision.",
      action:
        "Compare the same planned state and viewport. Inspect independent review and supporting evidence before a human decision.",
      camera:
        "Wipe across a fixed comparison, then pull back to the decision strip.",
      transition:
        "The comparison and review notes settle into the same durable run.",
      voiceover:
        "Compare matching page states and viewports. Read the independent review and its limitations, then decide whether to accept the change or request revision.",
      capability: "Matched evidence, independent QA and human judgment",
      source: "docs/counter-evidence-review-2026-10-21.md",
      boundary:
        "This is a concept comparison, not a real executed Northstar run. No QA pass or acceptance is claimed.",
    },
    {
      id: "record",
      seconds: 6,
      title: "Return to the same record",
      caption: "Every change, in context.",
      plate: "08-record.webp",
      tone: "light",
      closing: true,
      alt: "Source, diff and review records recede around a calm central space for the official HappyHands logo.",
      action:
        "Keep source, page evidence, code changes and review in the same run. Return through the website’s saved handoff link.",
      camera:
        "Pull back from the record; the official hand-and-wordmark logo settles into the clear center.",
      transition:
        "Hold the brand and the real website address for the final three seconds.",
      voiceover:
        "Keep the context together. Return to the same record, and make your product feel designed.",
      capability: "Durable job and run recovery",
      source: "docs/site-workbench-validation-2026-10-21.md",
      boundary:
        "The closing is a brand composition. It does not imply continuous monitoring, autonomous learning or a hosted agent service.",
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
