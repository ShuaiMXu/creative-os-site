import type { ThemeStyles } from "../theme-core/vendor/types/theme";
export type Draft = {
  schemaVersion: "0.2";
  status: "draft";
  id: string;
  project: string;
  revision: number;
  styles: ThemeStyles;
  baseline: ThemeStyles;
  provenance: { revision: string; source: string };
  foundation?: FoundationApproval;
};
type Entry = {
  name: string;
  status: "approved" | "deprecated";
  [key: string]: unknown;
};
export type FoundationApproval = {
  schemaVersion: "0.1";
  foundationVersion: string;
  reviewer: { type: "human" | "team"; name: string };
  reason: string;
  reviewedAt?: string;
  foundation: {
    brand: {
      principles: unknown[];
      voice: unknown[];
      assets: Entry[];
      [key: string]: unknown;
    };
    tokens: Entry[];
    components: Entry[];
    patterns: Entry[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
