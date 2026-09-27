export const apps = [
  {
    "index": "01",
    "state": "LOCAL",
    "title": "Review",
    "description": "Capture desktop, mobile and named task states. Diagnose, prioritize and confirm the evidence before selecting one scoped change.",
    "meta": [
      "CAPTURE · DIAGNOSIS"
    ],
    "action": "Read capture guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md"
  },
  {
    "index": "02",
    "state": "BOUNDED",
    "title": "Systematize",
    "description": "Extract brand, token, component and state candidates. Human approval freezes the Foundation version before it constrains changes or new pages.",
    "meta": [
      "BRAND · COMPONENTS"
    ],
    "action": "Read Foundation guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/README.md#design-a-new-surface"
  },
  {
    "index": "03",
    "state": "LOCAL",
    "title": "Fix",
    "description": "Give Codex or Claude Code a scoped brief in an isolated worktree. Retain the brief, code patch and execution record.",
    "meta": [
      "WORKTREE · PATCH"
    ],
    "action": "Read execution guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#choosing-a-coding-agent"
  },
  {
    "index": "04",
    "state": "REVIEW REQUIRED",
    "title": "Verify and learn",
    "description": "Recapture matching states, run structural checks and attach independent visual QA. Record accept or reject with a reason for the next review.",
    "meta": [
      "EVIDENCE · JUDGMENT"
    ],
    "action": "Read review guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#screenshot-aware-visual-review"
  }
];

export const elements = [
  {
    "kind": "button",
    "title": "Button",
    "description": "Primary action gets solid ink, never brand orange. One per screen."
  },
  {
    "kind": "input",
    "title": "Input",
    "description": "Typing, generating, error — every stage visible to the user."
  },
  {
    "kind": "status",
    "title": "AI Label",
    "description": "AI-assisted content is identifiable. Approved and pending never look the same."
  },
  {
    "kind": "tokens",
    "title": "Semantic Tokens",
    "description": "Don't hardcode hex values. Use variables. Change once, update everywhere."
  },
  {
    "kind": "tabs",
    "title": "Tabs",
    "description": "Diagnosis, design system, and visual QA share one navigation. No duplicates."
  },
  {
    "kind": "progress",
    "title": "Step Indicator",
    "description": "Where you are, what's blocking, what comes next — visible at a glance."
  },
  {
    "kind": "empty",
    "title": "Empty State",
    "description": "When there's nothing to show, tell users what to do. An icon alone isn't enough."
  },
  {
    "kind": "dialog",
    "title": "Confirm Dialog",
    "description": "Destructive actions explain consequences and offer a way back."
  },
  {
    "kind": "card",
    "title": "Content Card",
    "description": "Title, status, evidence, action — one card tells one story."
  }
];

export const hero = {
  "eyebrow": [
    "FOR INDEPENDENT BUILDERS",
    "OPEN SOURCE · LOCAL"
  ],
  "h1": "Make your product ",
  "h1Accent": "professional",
  "h1Suffix": ".",
  "copy": "Bring a design loop to your working app: organize brand and components, prioritize UX issues, scope code changes, and review the evidence together.",
  "cta": "Explore capabilities",
  "ctaSecondary": "View a real review"
};

export const screenPairs = [
  {
    "title": "Homepage · Desktop",
    "task": "Hierarchy",
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER",
    "before": {
      "src": "/runs/06dabc2c/before/desktop.png",
      "caption": "Homepage before the change"
    },
    "after": {
      "src": "/runs/06dabc2c/after/desktop.png",
      "caption": "Same viewport after"
    },
    "result": "VISUAL QA FAILED"
  },
  {
    "title": "Homepage · Mobile",
    "task": "Task flow",
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER",
    "before": {
      "src": "/runs/06dabc2c/before/mobile.png",
      "caption": "Mobile baseline"
    },
    "after": {
      "src": "/runs/06dabc2c/after/mobile.png",
      "caption": "Same state after"
    },
    "result": "STATIC COMPARISON"
  }
];

export const sections = {
  "apps": {
    "kicker": "01 / APPS",
    "title": "After the build",
    "copy": "Review the pages, systematize the foundation, fix within constraints, optimize visual and experience — each step's output feeds the next.",
    "link": "View source on GitHub ↗"
  },
  "explore": {
    "kicker": "02 / DESIGN SYSTEMS",
    "title": "Design system archive",
    "copy": "Brand references, real review cases and proposed presets, with their status made explicit. Previews are not installable libraries."
  },
  "screens": {
    "kicker": "03 / BEFORE & AFTER",
    "title": "See what changed",
    "copy": "A historical review of the HappyClaw repository at 1280×800 and 390×844. Independent visual QA failed: the desktop brand mark is clipped and needs repair and recapture. This is not a live deployment or conversion result.",
    "link": "Open the full review ↗"
  },
  "elements": {
    "kicker": "04 / UI ELEMENTS",
    "title": "Common components",
    "copy": "Nine component studies for discussing purpose and states. An installable component package is not yet available."
  },
  "getStarted": {
    "kicker": "05 / GET STARTED",
    "title": "Try a real product",
    "titleLine2": "Start with local evidence",
    "copy": "Install the core repository dependencies with Node.js 22.15+, pnpm 11.19+ and Chrome or Edge. Configure your target repository and preview using the guide. A first capture is the beginning of a review.",
    "quickstartLabel": "QUICKSTART",
    "quickstartTitle": "After setup, capture the baseline",
    "copyBtn": "Copy command"
  }
};

export const steps = [
  [
    "01",
    "Prepare",
    "Install core dependencies and configure the target repo, preview and Experience Spec."
  ],
  [
    "02",
    "Capture and diagnose",
    "Save a baseline, extract the Foundation and confirm one finding."
  ],
  [
    "03",
    "Edit and review",
    "Execute in isolation, recapture, attach visual QA and record a reasoned decision."
  ]
];

export const systems = [
  {
    "tag": "Design System",
    "title": "HappyHands",
    "description": "Dark surfaces, one warm accent used sparingly.",
    "values": [
      "#111111",
      "#F7F6F3",
      "#F57F28",
      "#96918A"
    ],
    "traits": [
      "Professional",
      "Calm",
      "Friendly"
    ],
    "href": "/brand/happyhands-logo-paper.png",
    "action": "View brand mark"
  },
  {
    "tag": "Case Study",
    "title": "HappyClaw",
    "description": "A real case with captures, changes and review records. The historical run shown here has an unresolved visual regression.",
    "values": [
      "BEFORE",
      "AFTER",
      "VERDICT"
    ],
    "traits": [
      "Web",
      "Review",
      "Evidence"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/happyclaw-case.md",
    "action": "Read case"
  },
  {
    "tag": "REFERENCE",
    "title": "Firefly",
    "description": "System first, pages second — an attempt worth studying.",
    "values": [
      "TOKENS",
      "STATES",
      "PATTERNS"
    ],
    "traits": [
      "System-first",
      "Archive"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/firefly-ui-kit-case.md",
    "action": "Read case"
  },
  {
    "tag": "PROPOSED PRESET",
    "title": "SaaS Starter",
    "description": "A proposed Foundation direction. A reusable template package has not been released.",
    "values": [
      "SHELL",
      "DATA",
      "FORMS"
    ],
    "traits": [
      "SaaS",
      "Desktop",
      "Template"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "View roadmap"
  },
  {
    "tag": "PROPOSED PRESET",
    "title": "Mobile Starter",
    "description": "A proposed Foundation direction. A reusable template package has not been released.",
    "values": [
      "NAV",
      "CONTENT",
      "PAYWALL"
    ],
    "traits": [
      "Mobile",
      "Consumer",
      "Template"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "View roadmap"
  },
  {
    "tag": "Planned",
    "title": "SwiftUI",
    "description": "Native path not proven yet. Noted, not promised.",
    "values": [
      "COLOR",
      "TYPE",
      "MOTION"
    ],
    "traits": [
      "SwiftUI",
      "Planned"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "View roadmap"
  }
];

export const ui = {
  "scrollNote": "SCROLL",
  "githubLink": "GitHub ↗",
  "footer": {
    "left": "HappyHands · AI Product Designer",
    "middle": "Evidence before claims",
    "right": "View source ↗"
  }
};

export const delivery = {
  "title": "Every review leaves an inspectable record",
  "copy": "The Harness governs stages and evidence. Skills supply design methods. A coding agent makes the change. You decide whether to accept it.",
  "items": [
    [
      "Context and evidence",
      "Product goals, source baseline, task states and desktop / mobile captures."
    ],
    [
      "Design Foundation",
      "Brand, semantic tokens, component states and patterns. Observed candidates stay separate from approved versions."
    ],
    [
      "Change and review",
      "A scoped brief, code patch, recaptures, structural checks and independent visual review."
    ],
    [
      "Judgment and next steps",
      "Accept / reject, rationale, unresolved findings and a run ledger. New surfaces start from an approved Foundation."
    ]
  ],
  "status": "Local engineering release: 27 versioned Skill contracts, with 17 bounded handlers and 10 contract-only placeholders. None is operational. Hosted monitoring, automatic learning, a calibrated Experience Score and subscriptions remain future work.",
  "link": "Read the complete Harness guide ↗"
};
