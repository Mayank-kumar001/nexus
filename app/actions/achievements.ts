"use server";

import { revalidatePath } from "next/cache";
import { DEPARTMENTS } from "@/lib/constants";
import { getTeamName } from "@/lib/team";
import { uploadProofImage } from "@/lib/imagekit";
import { centralDb, centralError, CENTRAL_ACTIVITIES, CENTRAL_TEAM_ID } from "@/lib/central";
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

    const fileName = uploaded.url.split("/").pop() || "proof.jpg";
    const mimeType = fileName.endsWith(".png") ? "image/png" : fileName.endsWith(".webp") ? "image/webp" : "image/jpeg";

    const { data: profiles, error: profilesError } = await centralDb()
      .from("profiles")
      .select("id")
      .eq("team_id", CENTRAL_TEAM_ID)
      .ilike("full_name", memberName);

    if (profilesError) {
      throw new Error(`Failed to lookup member: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return { ok: false, message: "Member not found in the central database. Please use their exact registered name." };
    }

    const memberId = profiles[0].id;

    const centralRecordId = crypto.randomUUID();
    const { error: centralSyncError } = await centralDb().from("submissions").insert({
      id: centralRecordId,
      team_id: CENTRAL_TEAM_ID,
      member_id: memberId,
      activity_id: activity.id,
      title: `${teamName}: ${memberName}`,
      occurred_on: achievedOn.toISOString(),
      details: `${department}: ${details}`,
      external_url: uploaded.url,
      status: "pending"
    });

    if (centralSyncError) {
      throw new Error(centralError(centralSyncError));
    }

    const { dbPool } = await import("@/lib/db");
    
    // Check if the user exists locally by email (to avoid unique constraint violations if IDs differ)
    let localUserId = user.id;
    const { rows: existingUsers } = await dbPool.query(`SELECT id FROM "user" WHERE email = $1`, [user.email]);
    
    if (existingUsers.length > 0) {
      localUserId = existingUsers[0].id;
      // Optionally update their details
      await dbPool.query(`
        UPDATE "user" SET 
          "name" = $2, "image" = $3, "role" = $4, "department" = $5, "team" = $6, "updatedAt" = NOW()
        WHERE "id" = $1
      `, [localUserId, user.name, user.image, user.role, user.department, user.team]);
    } else {
      // Insert new user
      await dbPool.query(`
        INSERT INTO "user" ("id", "name", "email", "image", "role", "department", "team", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        ON CONFLICT ("id") DO NOTHING
      `, [user.id, user.name, user.email, user.image, user.role, user.department, user.team]);
    }

    // Save locally so the dashboard can fetch it
    await dbPool.query(`
      INSERT INTO "achievement" (
        "id", "submitterId", "activityId", "memberName", "department", 
        "achievedOn", "details", "proofUrl", "proofFileId", "status", "centralSyncStatus", 
        "centralRecordId", "team", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, 'VERIFIED', 'SYNCED', $10, $11, NOW(), NOW()
      )
    `, [
      crypto.randomUUID(),
      localUserId,
      activity.id,
      memberName,
      department,
      achievedOn,
      details,
      uploaded.url,
      uploaded.fileId,
      centralRecordId,
      teamName
    ]);

    revalidatePath("/dashboard");

    return {
      ok: true,
      message:
        "Submission received. Your achievement has been successfully recorded to the AARVAK Point System.",
    };
  } catch (error) {
    console.error("===== submitAchievement ERROR =====", error);
    const message =
      error instanceof Error ? error.message : "Could not save this achievement. " + JSON.stringify(error);
    return { ok: false, message };
  }
}
