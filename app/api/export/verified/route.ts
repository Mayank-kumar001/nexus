import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { TEAM_NAME } from "@/lib/constants";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const expected = process.env.AARVAK_EXPORT_TOKEN;
  if (!expected) {
    return Response.json(
      { error: "Export is not configured. Set AARVAK_EXPORT_TOKEN." },
      { status: 503 }
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || token !== expected) {
    return unauthorized();
  }

  const markSynced = request.nextUrl.searchParams.get("markSynced") === "true";

  const records = await prisma.achievement.findMany({
    where: { status: "VERIFIED" },
    orderBy: { reviewedAt: "asc" },
    include: {
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });

  if (markSynced && records.length > 0) {
    await prisma.achievement.updateMany({
      where: { id: { in: records.map((record) => record.id) } },
      data: {
        centralSyncStatus: "SYNCED",
        exportedAt: new Date(),
      },
    });
  }

  return Response.json({
    source: "arrvak-nexus-dashboard",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    count: records.length,
    records: records.map((record) => ({
      id: record.id,
      memberName: record.memberName,
      department: record.department,
      team: TEAM_NAME,
      achievedOn: record.achievedOn.toISOString().slice(0, 10),
      details: record.details,
      proofUrl: record.proofUrl,
      verifiedAt: record.reviewedAt?.toISOString() ?? null,
      verifiedBy: record.reviewer,
      submittedAt: record.createdAt.toISOString(),
      centralSyncStatus: markSynced ? "SYNCED" : record.centralSyncStatus,
    })),
  });
}
