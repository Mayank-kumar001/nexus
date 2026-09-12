"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { rejectAchievement, verifyAchievement, type ReviewState } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const initial: ReviewState = { ok: false, message: "" };

export function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const [rejectState, rejectAction, rejecting] = useActionState(rejectAchievement, initial);

  useEffect(() => {
    if (!rejectState.message) return;
    toast.add({
      title: rejectState.ok ? "Rejected" : "Could not reject",
      description: rejectState.message,
      type: rejectState.ok ? "success" : "error",
    });
    if (rejectState.ok) router.push("/review");
  }, [rejectState, router]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        action={async (formData) => {
          const result = await verifyAchievement(formData);
          toast.add({
            title: result.ok ? "Verified" : "Could not verify",
            description: result.message,
            type: result.ok ? "success" : "error",
          });
          if (result.ok) router.push("/review");
        }}
        className="rounded-3xl border bg-card p-5"
      >
        <input type="hidden" name="id" value={id} />
        <h3 className="font-heading text-base font-medium">Verify</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Marks this record as eligible for the central AARVAK Point System. Official points are
          calculated there, not on this team dashboard.
        </p>
        <Button type="submit" className="mt-4">
          Verify record
        </Button>
      </form>
      <form action={rejectAction} className="rounded-3xl border bg-card p-5">
        <input type="hidden" name="id" value={id} />
        <h3 className="font-heading text-base font-medium">Reject</h3>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          Use this when proof is missing, unclear, or the claim cannot be confirmed.
        </p>
        <Label htmlFor="rejectionReason">Reason</Label>
        <Textarea id="rejectionReason" name="rejectionReason" required className="mt-2" />
        <Button type="submit" variant="destructive" className="mt-4" disabled={rejecting}>
          {rejecting ? "Rejecting…" : "Reject record"}
        </Button>
      </form>
    </div>
  );
}
