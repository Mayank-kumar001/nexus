import { NextRequest } from "next/server";
import { getCentralRecords } from "@/lib/central-records";

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

  const records = await getCentralRecords("verified");

  return Response.json({
    source: "arrvak-nexus-dashboard",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    count: records.length,
    records: records.map((record) => ({
      id: record.id,
      memberName: record.member?.full_name ?? null,
      department: record.member?.department ?? null,
      teamId: record.team_id,
      achievedOn: record.occurred_on,
      activity: record.activity?.label ?? null,
      details: record.details,
      proofUrl: record.external_url,
      verifiedAt: record.decided_at,
      verifiedBy: record.decided_by,
      submittedAt: record.submitted_at,
      status: record.status,
    })),
  });
}
