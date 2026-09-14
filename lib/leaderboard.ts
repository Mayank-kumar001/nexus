import { centralDb, centralError, CENTRAL_TEAM_ID } from "./central";
import { DEPARTMENTS } from "./constants";

export async function getTeamProgress() {
  const { data, error } = await centralDb()
    .from("submissions")
    .select("status, member_id")
    .eq("team_id", CENTRAL_TEAM_ID);
  if (error) throw new Error(centralError(error));

  const submissions = data ?? [];
  const memberIds = [...new Set(submissions.map((row) => row.member_id))];
  const { data: profiles, error: profileError } = memberIds.length
    ? await centralDb().from("profiles").select("id, department").in("id", memberIds)
    : { data: [], error: null };
  if (profileError) throw new Error(centralError(profileError));

  const countFor = (status: string) => submissions.filter((row) => row.status === status).length;

  const verifiedTotal = countFor("VERIFIED");
  const pendingTotal = countFor("PENDING");

  const departmentRows = [...DEPARTMENTS]
    .map((department) => ({
      department,
      verifiedCount: submissions.filter(
        (row) => row.status === "verified" && profiles?.find((profile) => profile.id === row.member_id)?.department === department
      ).length,
    }))
    .sort((a, b) => b.verifiedCount - a.verifiedCount);

  const maxDepartmentCount = Math.max(1, ...departmentRows.map((row) => row.verifiedCount));

  return {
    verifiedTotal,
    pendingTotal,
    departmentRows: departmentRows.map((row, index) => ({
      ...row,
      rank: index + 1,
      progress: Math.round((row.verifiedCount / maxDepartmentCount) * 100),
    })),
  };
}
