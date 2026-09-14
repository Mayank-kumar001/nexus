"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircleIcon, ImageIcon } from "@phosphor-icons/react";
import { submitAchievement, type SubmitState } from "@/app/actions/achievements";
import { DEPARTMENTS } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import type { CentralActivity } from "@/lib/central";

const initial: SubmitState = { ok: false, message: "" };

export function AchievementForm({
  defaultName,
  defaultDepartment,
  activities,
}: {
  defaultName: string;
  defaultDepartment?: string | null;
  activities: CentralActivity[];
}) {
  const [state, formAction, pending] = useActionState(submitAchievement, initial);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showIndividual, setShowIndividual] = useState(true);
  const [showTeam, setShowTeam] = useState(false);

  const visibleActivities = activities.filter((activity) => {
    return (showIndividual && activity.scope === "individual") || (showTeam && activity.scope === "team");
  });

  useEffect(() => {
    if (!state.message) return;
    toast.add({
      title: state.ok ? "Submitted" : "Could not submit",
      description: state.message,
      type: state.ok ? "success" : "error",
    });
  }, [state]);

  if (state.ok) {
    return (
      <Alert>
        <CheckCircleIcon />
        <AlertTitle>Submission received</AlertTitle>
        <AlertDescription>
          Core members will verify the proof before this can count toward official AARVAK points.
          Individual records and points stay with Core until then.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="memberName">Member name</Label>
          <Input id="memberName" name="memberName" required defaultValue={defaultName} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="achievedOn">Date</Label>
          <Input id="achievedOn" name="achievedOn" type="date" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="department">Department</Label>
          <NativeSelect
            id="department"
            name="department"
            required
            defaultValue={defaultDepartment ?? ""}
            className="w-full"
          >
            <NativeSelectOption value="">Select department</NativeSelectOption>
            {DEPARTMENTS.map((department) => (
              <NativeSelectOption key={department} value={department}>
                {department}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="activityId">Activity</Label>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <label className="flex items-center gap-2">
              <Checkbox checked={showIndividual} onCheckedChange={(checked) => setShowIndividual(checked === true)} />
              Individual activities
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={showTeam} onCheckedChange={(checked) => setShowTeam(checked === true)} />
              Team events
            </label>
          </div>
          <NativeSelect id="activityId" name="activityId" required className="w-full">
            <NativeSelectOption value="">Select activity</NativeSelectOption>
            {visibleActivities.map((activity) => (
              <NativeSelectOption key={activity.id} value={activity.id}>
                {activity.label}
                {` · ${activity.category.replace("_", " ")}`}
                {` · ${activity.scope}`}
                {activity.level ? ` · ${activity.level}` : ""}
                {activity.points !== null ? ` · ${activity.points} points` : ""}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {visibleActivities.length === 0 ? (
            <p className="text-sm text-destructive">Select Individual activities or Team events.</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="details">Achievement details</Label>
        <Textarea
          id="details"
          name="details"
          required
          minLength={12}
          placeholder="What was accomplished, where, and why it matters to the Tech Journey."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="proof">Proof / documentation (image)</Label>
        <label
          htmlFor="proof"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed bg-input/30 px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/40"
        >
          <ImageIcon className="size-6" />
          <span>{fileName ?? "JPG, PNG, WEBP or GIF · up to 8 MB"}</span>
        </label>
        <Input
          id="proof"
          name="proof"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
      </div>
      {state.message && !state.ok ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto sm:self-start justify-center">
        {pending ? "Uploading proof…" : "Submit for verification"}
      </Button>
    </form>
  );
}
