"use server";

import { revalidatePath } from "next/cache";
import { DEPARTMENTS } from "@/lib/constants";
import { getTeamName } from "@/lib/team";
import { uploadProofImage } from "@/lib/imagekit";
import { centralError, CENTRAL_ACTIVITIES, CENTRAL_TEAM_ID } from "@/lib/central";
import { requireUser } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";

export type SubmitState = {
  ok: boolean;
  message: string;
};

export async function submitAchievement(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const user = await requireUser();

  const memberName = String(formData.get("memberName") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const achievedOnRaw = String(formData.get("achievedOn") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const activityId = String(formData.get("activityId") ?? "").trim();
  const proof = formData.get("proof");

  if (!memberName || memberName.length < 2) {
    return { ok: false, message: "Enter the member name." };
  }
  if (!DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) {
    return { ok: false, message: "Choose a valid department." };
  }
  if (!achievedOnRaw) {
    return { ok: false, message: "Choose the achievement date." };
  }
  if (!details || details.length < 12) {
    return { ok: false, message: "Describe the achievement in more detail." };
  }
  if (!activityId) {
    return { ok: false, message: "Choose an activity." };
  }
  if (!(proof instanceof File) || proof.size === 0) {
    return { ok: false, message: "Upload a proof image." };
  }

  const achievedOn = new Date(`${achievedOnRaw}T00:00:00.000Z`);
  if (Number.isNaN(achievedOn.getTime())) {
    return { ok: false, message: "The achievement date is invalid." };
  }

  try {
    const uploaded = await uploadProofImage(proof);

    const activity = CENTRAL_ACTIVITIES.find((item) => item.id === activityId);
    if (!activity) throw new Error("Selected activity is not available.");
    
    const teamName = await getTeamName();

    const localUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, image: user.image },
      create: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        image: user.image,
        role: user.role,
        department: user.department,
        team: user.team 
      }
    });

    await prisma.achievement.create({
      data: {
        memberName,
        department,
        team: teamName,
        achievedOn,
        details,
        proofUrl: uploaded.url,
        proofFileId: uploaded.fileId,
        status: "PENDING",
        centralSyncStatus: "NOT_SYNCED",
        submitterId: localUser.id,
        activityId: activity.id,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/review");

    return {
      ok: true,
      message:
        "Submission received. Core members will verify it before it can count toward the official AARVAK Point System.",
    };
  } catch (error) {
    console.error("===== submitAchievement ERROR =====", error);
    const message =
      error instanceof Error ? error.message : "Could not save this achievement. " + JSON.stringify(error);
    return { ok: false, message };
  }
}
