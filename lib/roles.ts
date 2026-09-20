export const USER_ROLES = {
  MEMBER: "MEMBER",
  CORE: "CORE",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

import { getTeamSettings } from "./team";

export async function parseCoreEmails() {
  const settings = await getTeamSettings();
  return settings.coreMemberEmails;
}

export async function isCoreEmail(email: string | null | undefined) {
  if (!email) return false;
  const coreEmails = await parseCoreEmails();
  return coreEmails.includes(email.toLowerCase());
}

export function isCoreRole(role: string | null | undefined) {
  return role === USER_ROLES.CORE;
}
