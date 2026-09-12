"use server";

import { revalidatePath } from "next/cache";
import { DEPARTMENTS, TEAM_NAME } from "@/lib/constants";
import { uploadProofImage } from "@/lib/imagekit";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

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
  if (!(proof instanceof File) || proof.size === 0) {
    return { ok: false, message: "Upload a proof image." };
  }

  const achievedOn = new Date(`${achievedOnRaw}T00:00:00.000Z`);
  if (Number.isNaN(achievedOn.getTime())) {
    return { ok: false, message: "The achievement date is invalid." };
  }

  try {
    const uploaded = await uploadProofImage(proof);

    await prisma.achievement.create({
      data: {
        memberName,
        department,
        team: TEAM_NAME,
        achievedOn,
        details,
        proofUrl: uploaded.url,
        proofFileId: uploaded.fileId,
        submitterId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/review");

    return {
      ok: true,
      message:
        "Submission received. Core members will verify it before it can count toward the official AARVAK Point System.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save this achievement.";
    return { ok: false, message };
  }
}
