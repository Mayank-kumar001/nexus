import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import { requireCore } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function statusVariant(status: string) {
  if (status === "VERIFIED") return "default" as const;
  if (status === "REJECTED") return "destructive" as const;
  return "outline" as const;
}

export default async function RecordsPage() {
  await requireCore();
  const records = await prisma.achievement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-8">
        <p className="text-xs tracking-[0.24em] text-primary uppercase">Core</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">All records</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Verified rows are eligible for the central AARVAK dashboard export at{" "}
          <code className="text-foreground">/api/export/verified</code>.
        </p>
      </div>
      <div className="rounded-4xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sync</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No submissions yet.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Link href={`/review/${record.id}`} className="hover:underline">
                      {record.memberName}
                    </Link>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{format(record.achievedOn, "d MMM yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {record.centralSyncStatus}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
