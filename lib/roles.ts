export const USER_ROLES = {
  MEMBER: "MEMBER",
  CORE: "CORE",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function parseCoreEmails() {
  return (process.env.CORE_MEMBER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isCoreEmail(email: string | null | undefined) {
  if (!email) return false;
  return parseCoreEmails().includes(email.toLowerCase());
}

export function isCoreRole(role: string | null | undefined) {
  return role === USER_ROLES.CORE;
}
