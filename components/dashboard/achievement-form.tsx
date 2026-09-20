"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircleIcon, ImageIcon, User, Buildings, FileText } from "@phosphor-icons/react";
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
      <Alert className="bg-[#111915] border-[#1a2620] text-white rounded-xl">
        <CheckCircleIcon className="text-[#86efac] w-5 h-5" />
        <AlertTitle className="text-lg font-medium mb-2">Submission received</AlertTitle>
        <AlertDescription className="text-[#8B9D96]">
          Core members will verify the proof before this can count toward official AARVAK points.
          Individual records and points stay with Core until then.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      
      {/* Section 1: Member & Date */}
      <div className="bg-[#111915] border border-[#1a2620] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-medium text-white tracking-tight">Member Details</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="memberName" className="text-white text-sm font-medium">Member name *</Label>
            <Input id="memberName" name="memberName" required defaultValue={defaultName} className="rounded-lg bg-[#070A09] border-[#1a2620] text-white h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#86efac] focus-visible:border-[#86efac] transition-all" placeholder="Enter member name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="achievedOn" className="text-white text-sm font-medium">Date *</Label>
            <Input id="achievedOn" name="achievedOn" type="date" required className="rounded-lg bg-[#070A09] border-[#1a2620] text-white h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#86efac] focus-visible:border-[#86efac] transition-all style-color-scheme-dark" style={{ colorScheme: 'dark' }} />
          </div>
        </div>
      </div>

      {/* Section 2: Department & Activity */}
      <div className="bg-[#111915] border border-[#1a2620] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Buildings className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-medium text-white tracking-tight">Categorization</h2>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="department" className="text-white text-sm font-medium">Department *</Label>
          <NativeSelect id="department" name="department" required defaultValue={defaultDepartment ?? ""} className="w-full rounded-lg bg-[#070A09] border-[#1a2620] text-white h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#86efac] focus-visible:border-[#86efac] transition-all">
            <NativeSelectOption value="">Select department</NativeSelectOption>
            {DEPARTMENTS.map((department) => (
              <NativeSelectOption key={department} value={department}>{department}</NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="activityId" className="text-white text-sm font-medium">Activity *</Label>
          <div className="flex flex-wrap gap-4 text-sm text-[#8B9D96] mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={showIndividual} onCheckedChange={(checked) => setShowIndividual(checked === true)} className="border-[#1a2620] data-[state=checked]:bg-[#86efac] data-[state=checked]:text-[#0B100E] rounded" />
              Individual activities
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={showTeam} onCheckedChange={(checked) => setShowTeam(checked === true)} className="border-[#1a2620] data-[state=checked]:bg-[#86efac] data-[state=checked]:text-[#0B100E] rounded" />
              Team events
            </label>
          </div>
          <NativeSelect id="activityId" name="activityId" required className="w-full rounded-lg bg-[#070A09] border-[#1a2620] text-white h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#86efac] focus-visible:border-[#86efac] transition-all">
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
            <p className="text-sm text-red-400 mt-1">Select Individual activities or Team events.</p>
          ) : null}
        </div>
      </div>

      {/* Section 3: Documentation */}
      <div className="bg-[#111915] border border-[#1a2620] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-[#86efac]" />
          <h2 className="text-xl font-medium text-white tracking-tight">Documentation</h2>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="details" className="text-white text-sm font-medium">Achievement details *</Label>
          <Textarea
            id="details"
            name="details"
            required
            minLength={12}
            className="rounded-lg bg-[#070A09] border-[#1a2620] text-white p-4 focus-visible:ring-1 focus-visible:ring-[#86efac] focus-visible:border-[#86efac] transition-all min-h-[120px] resize-y"
            placeholder="What was accomplished, where, and why it matters to the Tech Journey."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="proof" className="text-white text-sm font-medium">Proof / documentation (image) *</Label>
          <label
            htmlFor="proof"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#2a3f33] bg-[#070A09] px-4 py-10 text-center text-sm text-[#8B9D96] transition-colors hover:border-[#86efac] hover:bg-[#0a0f0d] group"
          >
            <ImageIcon className="w-8 h-8 text-[#364b40] group-hover:text-[#86efac] transition-colors" />
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
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
        <Button type="submit" disabled={pending} className="w-full sm:w-[280px] justify-center rounded-lg bg-[#86efac] text-[#0a0f0d] hover:bg-[#6ce096] font-semibold h-14 text-base transition-colors shadow-[0_0_20px_rgba(134,239,172,0.15)]">
          {pending ? "Uploading proof…" : "Submit for Verification"}
        </Button>
        {state.message && !state.ok ? (
          <p className="text-sm text-red-400 font-medium">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
