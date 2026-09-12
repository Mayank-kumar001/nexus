"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireCore } from "@/lib/session";

export type ReviewState = {
  ok: boolean;
  message: string;
};

export async function verifyAchievement(formData: FormData): Promise<ReviewState> {
  const reviewer = await requireCore();
  const id = String(formData.get("id") ?? "");

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "PENDING") {
    return { ok: false, message: "This record has already been reviewed." };
  }

  await prisma.achievement.update({
    where: { id },
    data: {
      status: "VERIFIED",
      centralSyncStatus: "READY",
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      rejectionReason: null,
    },
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

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Record not found." };
  if (existing.status !== "PENDING") {
    return { ok: false, message: "This record has already been reviewed." };
  }

  await prisma.achievement.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      rejectionReason,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/review");
  revalidatePath(`/review/${id}`);
  revalidatePath("/review/records");

  return { ok: true, message: "Rejected. This will not count toward official points." };
}
