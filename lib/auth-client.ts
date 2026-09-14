"use client";

import { createBrowserClient } from "@supabase/ssr";

export const authClient = createBrowserClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
);

export async function ensureCentralProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
	const fullName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Member");
	return authClient.from("profiles").upsert(
		{
			id: user.id,
			full_name: fullName,
			department: String(user.user_metadata?.department ?? "Technical"),
			enrollment_no: null,
			team_id: "54a0575b-8f20-4882-9d4f-391c94ffd560",
			sprint_track: null,
			is_active: true,
		},
		{ onConflict: "id", ignoreDuplicates: true },
	);
}
