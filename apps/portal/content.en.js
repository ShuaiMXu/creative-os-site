export const apps = [
  {
    "index": "01",
    "state": "Runs locally",
    "title": "A list of issues",
    "description": "Each finding includes its page, screenshot and impact so you can decide what to fix first.",
    "meta": [
      "Screenshots · Issues · Priorities"
    ],
    "action": "Read capture guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md"
  },
  {
    "index": "02",
    "state": "Review required",
    "title": "Your design rules",
    "description": "A record of existing colors, fonts and components, with rules that still need your review.",
    "meta": [
      "Brand · Components · Rules"
    ],
    "action": "Read Foundation guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/README.md#design-a-new-surface"
  },
  {
    "index": "03",
    "state": "Runs locally",
    "title": "Changes you can inspect",
    "description": "A separate working copy and code diff show exactly what changed.",
    "meta": [
      "Working copy · Code diff"
    ],
    "action": "Read execution guide",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#choosing-a-coding-agent"
  },
  {
    "index": "04",
    "state": "Review required",
    "title": "Before-and-after records",
    "description": "Matched page sizes and states help you compare results and record why you keep or reject a change.",
    "meta": [
      "Comparison · Review notes"
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
  "copy": "Find interface issues, organize your design rules and let AI help make changes. Compare the pages and choose what to keep.",
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
    "kicker": "01 / What you get",
    "title": "A record of every review",
    "copy": "Keep the findings, design rules, code changes and review results together.",
    "link": "View source on GitHub"
  },
  "explore": {
    "kicker": "02 / DESIGN SYSTEMS",
    "title": "Choose your design system",
    "copy": "Start with HappyHands rules and components, then choose a foundation for your project. Keep your existing brand and document its rules first if you prefer."
  },
  "screens": {
    "kicker": "03 / BEFORE & AFTER",
    "title": "See what changed",
    "copy": "A historical review of the HappyClaw repository at 1280×800 and 390×844. Independent visual QA failed: the desktop brand mark is clipped and needs repair and recapture. This is not a live deployment or conversion result.",
    "link": "Open the full review"
  },
  "elements": {
    "kicker": "04 / UI ELEMENTS",
    "title": "Common components",
    "copy": "Nine component studies for discussing purpose and states. An installable component package is not yet available."
  },
  "getStarted": {
    "kicker": "05 / GET STARTED",
    "title": "Try a real product",
    "titleLine2": "Start with one page",
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
    "href": "/systems/happyhands/",
    "action": "Explore design system"
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
  "githubLink": "GitHub",
  "footer": {
    "left": "HappyHands · AI Product Designer",
    "middle": "Make every page easier to use",
    "right": "View source"
  }
};

export const delivery = {
  "title": "Look back at every change",
  "copy": "The tools collect pages and suggestions. Your coding assistant makes the changes you approve. Review the original pages, changes and check results whenever you need.",
  "items": [
    [
      "Understand the project",
      "Record the product goals and original desktop and mobile pages."
    ],
    [
      "Design rules",
      "Collect colors, fonts and components. Keep suggestions separate from the rules you have adopted."
    ],
    [
      "Change and review",
      "View the change summary, code differences, before-and-after pages and check results."
    ],
    [
      "Choose what to keep",
      "Keep the changes you like and record what needs more work. Use your approved design rules for new pages."
    ]
  ],
  "status": "Installation and local setup are required. Automatic monitoring, learning and subscriptions are not available yet. See the development guide for implementation details.",
  "link": "Read development guide"
};
