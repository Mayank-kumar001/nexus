"use server";

import { revalidatePath } from "next/cache";
import { centralDb, centralError } from "@/lib/central";
import { requireCore } from "@/lib/session";

export type ReviewState = {
  ok: boolean;
  message: string;
};

export async function verifyAchievement(formData: FormData): Promise<ReviewState> {
  const reviewer = await requireCore();
  const id = String(formData.get("id") ?? "");

  const { data: existing, error: lookupError } = await centralDb()
    .from("submissions")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (lookupError) return { ok: false, message: centralError(lookupError) };
  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "pending") return { ok: false, message: "This record has already been reviewed." };

  const { error } = await centralDb().rpc("decide_submission", {
    p_submission_id: id,
    p_decision: "verified",
  });
  if (error) return { ok: false, message: centralError(error) };

  revalidatePath("/dashboard");
  revalidatePath("/review");
  revalidatePath(`/review/${id}`);
  revalidatePath("/review/records");

  return { ok: true, message: "Verified. This record is ready for the central AARVAK dashboard." };
}

export async function rejectAchievement(
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const reviewer = await requireCore();
  const id = String(formData.get("id") ?? "");
  const rejectionReason = String(formData.get("rejectionReason") ?? "").trim();

  if (rejectionReason.length < 8) {
    return { ok: false, message: "Add a short reason so the member can correct this later." };
  }

  const { data: existing, error: lookupError } = await centralDb()
    .from("submissions")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (lookupError) return { ok: false, message: centralError(lookupError) };
  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "pending") return { ok: false, message: "This record has already been reviewed." };

  const { error } = await centralDb().rpc("decide_submission", {
    p_submission_id: id,
    p_decision: "rejected",
    p_note: rejectionReason,
  });
  if (error) return { ok: false, message: centralError(error) };

  revalidatePath("/dashboard");
  revalidatePath("/review");
  revalidatePath(`/review/${id}`);
  revalidatePath("/review/records");

  return { ok: true, message: "Rejected. This will not count toward official points." };
}
