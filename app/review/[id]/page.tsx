import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import { requireCore } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/review/review-actions";

function statusLabel(status: string) {
  if (status === "VERIFIED") return "Verified";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCore();
  const { id } = await params;
  const record = await prisma.achievement.findUnique({
    where: { id },
    include: {
      submitter: { select: { name: true, email: true } },
      reviewer: { select: { name: true, email: true } },
    },
  });

  if (!record) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.24em] text-primary uppercase">Proof review</p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">{record.memberName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Submitted by {record.submitter.name} · {record.submitter.email}
          </p>
        </div>
        <Badge variant={record.status === "REJECTED" ? "destructive" : "outline"}>
          {statusLabel(record.status)}
        </Badge>
      </div>
      <dl className="mb-8 grid gap-4 rounded-4xl border bg-card p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Department</dt>
          <dd className="mt-1 text-sm">{record.department}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Date</dt>
          <dd className="mt-1 text-sm">{format(record.achievedOn, "d MMMM yyyy")}</dd>
        </div>
        <div className="sm:col-span-3">
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Details</dt>
          <dd className="mt-1 text-sm leading-6">{record.details}</dd>
        </div>
        {record.rejectionReason ? (
          <div className="sm:col-span-3">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Rejection</dt>
            <dd className="mt-1 text-sm">{record.rejectionReason}</dd>
          </div>
        ) : null}
        {record.reviewer ? (
          <div className="sm:col-span-3">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Reviewed by</dt>
            <dd className="mt-1 text-sm">
              {record.reviewer.name} · {record.reviewedAt ? format(record.reviewedAt, "d MMM yyyy HH:mm") : ""}
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mb-8 overflow-hidden rounded-4xl border bg-card">
        <div className="relative aspect-[16/10] bg-muted">
          <Image
            src={record.proofUrl}
            alt={`Proof uploaded for ${record.memberName}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      {record.status === "PENDING" ? <ReviewActions id={record.id} /> : (
        <p className="text-sm text-muted-foreground">
          This record is {statusLabel(record.status).toLowerCase()} and ready-state for central sync is{" "}
          {record.centralSyncStatus.replace("_", " ").toLowerCase()}.
        </p>
      )}
    </div>
  );
}
