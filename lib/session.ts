import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase-server";
import { CENTRAL_TEAM_ID } from "./central";
import { USER_ROLES, type UserRole } from "./roles";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  department: string | null;
  team: string | null;
};

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const db = await supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  let { data: profile } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) {
    const { data: createdProfile } = await db
      .from("profiles")
      .insert({
        id: user.id,
        full_name: String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Member"),
        department: String(user.user_metadata?.department ?? "Technical"),
        enrollment_no: null,
        team_id: CENTRAL_TEAM_ID,
        sprint_track: null,
        is_active: true,
      })
      .select("*")
      .maybeSingle();
    profile = createdProfile;
  }
  if (!profile) return null;
  const { data: roleRow } = await db.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  const role: UserRole = roleRow?.role === "core" || roleRow?.role === "lead" ? USER_ROLES.CORE : USER_ROLES.MEMBER;

  return {
    id: user.id,
    name: profile.full_name,
    email: user.email ?? "",
    image: profile.avatar_path,
    role,
    department: profile.department,
    team: profile.team_id,
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireCore() {
  const user = await requireUser();
  if (user.role !== USER_ROLES.CORE) redirect("/dashboard");
  return user;
}
