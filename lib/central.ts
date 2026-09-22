import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CentralProfile = {
  id: string;
  full_name: string;
  department: string;
  enrollment_no: string | null;
  team_id: string;
  sprint_track: "code" | "open_source" | "build" | "pitch" | null;
  avatar_path: string | null;
  is_active: boolean;
  created_at: string;
};

export type CentralActivity = {
  id: string;
  code: string;
  category: "team_activity" | "individual" | "sprint_track" | "bonus";
  scope: "team" | "individual";
  label: string;
  level: string | null;
  points: number | null;
  is_variable: boolean;
  requires_proof: boolean;
  proof_hint: string | null;
  is_active: boolean;
  sort_order: number;
};

export const CENTRAL_ACTIVITIES: CentralActivity[] = [
  ["12d1779b-16ec-4bef-9f0f-27dc2f97fb3e", "open_source_pr_society", "individual", "individual", "Open Source", "PR Merged in Society Repository", 25, "Based on Pull Request status and repository type.", 14],
  ["186ca2c6-3eee-4fda-977e-572f2ccf8986", "external_hackathon_first", "team_activity", "team", "External Hackathon", "1st Place", 50, "Requires valid certificate/proof.", 8],
  ["1be6e432-8421-4477-b673-4754098d5f92", "dsa_streak_weekly", "individual", "individual", "DSA Streak", "7-day DSA streak", 20, null, 18],
  ["20f77335-cc70-4d04-96fa-6ce5090e7878", "external_hackathon_second", "team_activity", "team", "External Hackathon", "2nd Place", 30, "Requires valid certificate/proof.", 9],
  ["30b3442f-c2f6-4598-b35e-76cf594d5a1c", "sprint_track_runnerup", "sprint_track", "individual", "Sprint Track Scoring", "Runner-up", 15, null, 25],
  ["405adba8-8af3-4c08-94aa-fcefcf8d3ed5", "weekly_challenge_runnerup", "team_activity", "team", "Weekly Challenge", "Runner-up", 15, "Awarded to the team based on challenge placement.", 3],
  ["47a388e5-d5b6-4420-8655-72c6925a4dd3", "external_event_participation", "individual", "individual", "External Event Participation", "Attendance / Participation", 10, null, 23],
  ["4bda74b6-3f4b-485e-94f6-fd96106a54d5", "tech_talk", "individual", "individual", "Tech Talk", "Delivery", 15, null, 21],
  ["514be90a-efa9-4a9a-8411-e1c11b441440", "open_source_pr_external", "individual", "individual", "Open Source", "PR Merged in External Public Repository", 20, "Based on Pull Request status and repository type.", 13],
  ["53df9487-b6ac-4b23-b2d6-dfca2806c588", "sprint_track_participation", "sprint_track", "individual", "Sprint Track Scoring", "Participation", 8, null, 26],
  ["5db929d2-460a-49d5-a42d-18c43eaa9e10", "dsa_streak_monthly", "individual", "individual", "DSA Streak", "Monthly DSA streak", 100, null, 19],
  ["5f7860e6-e8c8-4fdc-bc83-53db3455b449", "external_hackathon_third", "team_activity", "team", "External Hackathon", "3rd Place", 20, "Requires valid certificate/proof.", 10],
  ["63908c56-75cb-4939-92ab-02aeeee87622", "biweekly_meetup_attendance", "team_activity", "team", "Bi-Weekly Meetup", "Attendance", 5, "For each team member present.", 1],
  ["643effe3-41ef-4174-bd2c-e21de21848dd", "final_major_project_other", "team_activity", "team", "Final / Major Project", "Other participating teams", 50, "Awarded at the conclusion of the 75-day sprint.", 17],
  ["6d197032-3ef8-45ce-8bf7-123d6f96a780", "external_hackathon_participation", "team_activity", "team", "External Hackathon", "Participation", 10, "Requires valid certificate/proof.", 11],
  ["88ea3e28-9cb9-4e7d-a800-842111b5b3ef", "weekly_challenge_participation", "team_activity", "team", "Weekly Challenge", "Participation", 5, "Awarded to the team based on challenge placement.", 4],
  ["95bf6848-54dc-4ac3-841d-13c30c22b002", "society_project_basic", "team_activity", "team", "Society Project", "Basic", 10, "Awarded to the team upon successful submission and evaluation.", 5],
  ["a588735f-979e-4620-a156-980866459dbd", "blog_article", "individual", "individual", "Blog / Article", "Publication", 10, null, 22],
  ["c222b478-7f37-481c-8aff-057bfaeaf099", "society_project_intermediate", "team_activity", "team", "Society Project", "Intermediate", 20, "Awarded to the team upon successful submission and evaluation.", 6],
  ["c8567c02-7b5e-43ca-9514-918b5e0fd920", "final_major_project_runnerup", "team_activity", "team", "Final / Major Project", "Runner-up", 100, "Awarded at the conclusion of the 75-day sprint.", 16],
  ["d0a09c88-88b1-409a-8160-f2339f7b0d61", "sprint_track_full_streak", "sprint_track", "individual", "Sprint Track Scoring", "Full Track Streak (one-time bonus)", 30, null, 27],
  ["d0d22a14-de9d-4313-bf94-65ef5329687b", "sprint_track_winner", "sprint_track", "individual", "Sprint Track Scoring", "Winner", 25, null, 24],
  ["e13c6daa-5fe7-4281-a348-dd806162aeae", "society_project_advanced", "team_activity", "team", "Society Project", "Advanced", 30, "Awarded to the team upon successful submission and evaluation.", 7],
  ["eb37d239-40ec-41b7-b035-ed63c592e3c8", "weekly_challenge_winner", "team_activity", "team", "Weekly Challenge", "Winner", 30, "Awarded to the team based on challenge placement.", 2],
  ["edddbb71-2983-48e5-872c-08c82fab05c8", "final_major_project_winner", "team_activity", "team", "Final / Major Project", "Winner", 250, "Awarded at the conclusion of the 75-day sprint.", 15],
  ["fd0cec92-eb2f-4c72-8f66-f5e4bce71350", "open_source_pr_raised", "individual", "individual", "Open Source", "PR Raised", 10, "Based on Pull Request status and repository type.", 12],
  ["ffb2b3a1-c77b-4d9d-92a0-7ae33d8050b6", "research_paper", "individual", "individual", "Research Paper", "Publication / Submission", 50, null, 20],
].map(([id, code, category, scope, label, level, points, proof_hint, sort_order]) => ({
  id,
  code,
  category,
  scope,
  label,
  level,
  points,
  is_variable: false,
  requires_proof: true,
  proof_hint,
  is_active: true,
  sort_order,
})) as CentralActivity[];

export type CentralSubmission = {
  id: string;
  member_id: string;
  team_id: string;
  activity_id: string;
  occurred_on: string;
  title: string;
  details: string | null;
  external_url: string | null;
  status: "pending" | "needs_info" | "verified" | "rejected" | "revoked";
  submitted_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision_note: string | null;
  awarded_points: number | null;
  override_reason: string | null;
  penalty_points: number;
  net_points: number | null;
  meetup_id: string | null;
};

const centralUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const centralKey = process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function centralDb(): SupabaseClient {
  return createClient(required(centralUrl, "SUPABASE_URL"), required(centralKey, "SUPABASE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const CENTRAL_TEAM_ID = process.env.CENTRAL_TEAM_ID ?? "54a0575b-8f20-4882-9d4f-391c94ffd560";

export function centralError(error: { message?: string } | null) {
  return error?.message ?? "Central dashboard request failed.";
}

export type CentralJson = Json;