import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getCentralRecord } from "@/lib/central-records";
import { requireCore } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/review/review-actions";

function statusLabel(status: string) {
  if (status === "verified") return "Verified";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCore();
  const { id } = await params;
  const record = await getCentralRecord(id);

  if (!record) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.24em] text-primary uppercase">Proof review</p>
          <h1 className="mt-2 font-heading text-3xl tracking-tight">{record.member?.full_name ?? "Unknown member"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {record.activity?.label ?? record.title}
          </p>
        </div>
        <Badge variant={record.status === "rejected" ? "destructive" : "outline"}>
          {statusLabel(record.status)}
        </Badge>
      </div>
      <dl className="mb-8 grid gap-4 rounded-4xl border bg-card p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Department</dt>
          <dd className="mt-1 text-sm">{record.member?.department ?? "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Date</dt>
          <dd className="mt-1 text-sm">{format(new Date(record.occurred_on), "d MMMM yyyy")}</dd>
        </div>
        <div className="sm:col-span-3">
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Details</dt>
          <dd className="mt-1 text-sm leading-6">{record.details ?? record.title}</dd>
        </div>
        {record.decision_note ? (
          <div className="sm:col-span-3">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Rejection</dt>
            <dd className="mt-1 text-sm">{record.decision_note}</dd>
          </div>
        ) : null}
        {record.decided_at ? (
          <div className="sm:col-span-3">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Reviewed by</dt>
            <dd className="mt-1 text-sm">
              {record.decided_by ?? "Central reviewer"} · {format(new Date(record.decided_at), "d MMM yyyy HH:mm")}
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mb-8 overflow-hidden rounded-4xl border bg-card">
        <div className="relative aspect-[16/10] bg-muted">
          <Image
            src={record.external_url ?? ""}
            alt={`Proof uploaded for ${record.member?.full_name ?? "member"}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      {record.status === "pending" ? <ReviewActions id={record.id} /> : (
        <p className="text-sm text-muted-foreground">
          This record is {statusLabel(record.status).toLowerCase()} in the central dashboard.
        </p>
      )}
    </div>
  );
}
