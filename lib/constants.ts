export const DEPARTMENTS = [
  "Technical",
  "Design",
  "Content",
  "Events",
  "Outreach",
  "Operations",
  "Core",
] as const;

export const TEAM_NAME = "Nexus";

export const MAX_PROOF_BYTES = 8 * 1024 * 1024;
export const PROOF_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
