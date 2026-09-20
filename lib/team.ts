import { centralDb, CENTRAL_TEAM_ID } from "./central";

export async function getTeamSettings() {
  try {
    const { data, error } = await centralDb()
      .from("teams")
      .select("name, core_member_emails")
      .eq("id", CENTRAL_TEAM_ID)
      .single();

    if (error || !data) {
      // Fallback if the remote table is unreachable or empty
      return getFallbackSettings();
    }

    return {
      name: data.name || process.env.TEAM_NAME || "Nexus",
      coreMemberEmails: data.core_member_emails
        ? (Array.isArray(data.core_member_emails)
            ? data.core_member_emails
            : String(data.core_member_emails).split(","))
            .map((e: string) => e.trim().toLowerCase())
            .filter(Boolean)
        : getFallbackEmails(),
    };
  } catch (err) {
    return getFallbackSettings();
  }
}

export async function getTeamName() {
  const settings = await getTeamSettings();
  return settings.name;
}

function getFallbackEmails() {
  return (process.env.CORE_MEMBER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function getFallbackSettings() {
  return {
    name: process.env.TEAM_NAME || "Nexus",
    coreMemberEmails: getFallbackEmails(),
  };
}
