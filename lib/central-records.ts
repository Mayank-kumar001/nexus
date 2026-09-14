import {
  centralDb,
  centralError,
  CENTRAL_TEAM_ID,
  CENTRAL_ACTIVITIES,
  type CentralActivity,
  type CentralProfile,
  type CentralSubmission,
} from "./central";

export type CentralRecord = CentralSubmission & {
  member: CentralProfile | null;
  activity: CentralActivity | null;
};

export async function getCentralActivities() {
  return CENTRAL_ACTIVITIES;
}

async function lookup(recordRows: CentralSubmission[]) {
  const memberIds = [...new Set(recordRows.map((row) => row.member_id))];
  const activityIds = [...new Set(recordRows.map((row) => row.activity_id))];
  const db = centralDb();
  const [{ data: members, error: memberError }, { data: activities, error: activityError }] = await Promise.all([
    memberIds.length ? db.from("profiles").select("*").in("id", memberIds) : Promise.resolve({ data: [], error: null }),
    activityIds.length ? db.from("activity_catalog").select("*").in("id", activityIds) : Promise.resolve({ data: [], error: null }),
  ]);
  if (memberError) throw new Error(centralError(memberError));
  if (activityError) throw new Error(centralError(activityError));

  return recordRows.map((row) => ({
    ...row,
    member: (members as CentralProfile[] | null)?.find((member) => member.id === row.member_id) ?? null,
    activity: (activities as CentralActivity[] | null)?.find((activity) => activity.id === row.activity_id) ?? null,
  }));
}

export async function getCentralRecords(status?: CentralSubmission["status"]) {
  let query = centralDb().from("submissions").select("*").eq("team_id", CENTRAL_TEAM_ID).order("submitted_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(centralError(error));
  return lookup((data ?? []) as CentralSubmission[]);
}

export async function getCentralRecord(id: string) {
  const { data, error } = await centralDb()
    .from("submissions")
    .select("*")
    .eq("id", id)
    .eq("team_id", CENTRAL_TEAM_ID)
    .maybeSingle();
  if (error) throw new Error(centralError(error));
  if (!data) return null;
  const [record] = await lookup([data as CentralSubmission]);
  return record;
}