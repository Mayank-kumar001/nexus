"use server";

import { revalidatePath } from "next/cache";
import { centralDb, centralError, CENTRAL_TEAM_ID } from "@/lib/central";
import { requireCore } from "@/lib/session";
import { prisma } from "@/lib/db";

export type ReviewState = {
  ok: boolean;
  message: string;
};

export async function verifyAchievement(formData: FormData): Promise<ReviewState> {
  const reviewer = await requireCore();
  const id = String(formData.get("id") ?? "");

  const existing = await prisma.achievement.findUnique({
    where: { id }
  });

  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "PENDING") return { ok: false, message: "This record has already been reviewed." };
  if (!existing.activityId) return { ok: false, message: "This record is missing an activity ID." };

  const fileName = existing.proofUrl.split("/").pop() || "proof.jpg";
  const mimeType = fileName.endsWith(".png") ? "image/png" : fileName.endsWith(".webp") ? "image/webp" : "image/jpeg";

  // Sync to central DB
  const { error: centralSyncError } = await centralDb().rpc("submit_achievement", {
    p_id: existing.id,
    p_team_id: CENTRAL_TEAM_ID,
    p_activity_id: existing.activityId,
    p_title: `${existing.team}: ${existing.memberName}`,
    p_occurred_on: existing.achievedOn.toISOString(),
    p_details: `${existing.department}: ${existing.details}`,
    p_external_url: existing.proofUrl,
    p_proofs: [
      {
        team_id: CENTRAL_TEAM_ID,
        storage_path: existing.proofUrl,
        file_name: fileName,
        mime_type: mimeType,
        size_bytes: 0,
      },
    ],
  });

  if (centralSyncError) return { ok: false, message: centralError(centralSyncError) };

  // Update local DB
  await prisma.achievement.update({
    where: { id },
    data: {
      status: "VERIFIED",
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      centralSyncStatus: "SYNCED"
    }
  });

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

  const existing = await prisma.achievement.findUnique({
    where: { id }
  });

  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "PENDING") return { ok: false, message: "This record has already been reviewed." };

  await prisma.achievement.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason,
      reviewedById: reviewer.id,
      reviewedAt: new Date()
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/review");
  revalidatePath(`/review/${id}`);
  revalidatePath("/review/records");

  return { ok: true, message: "Rejected. This will not count toward official points." };
}
