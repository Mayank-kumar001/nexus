import { AchievementForm } from "@/components/dashboard/achievement-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export default async function SubmitPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[11px] tracking-[0.24em] text-primary uppercase sm:text-xs">Record</p>
      <h1 className="mt-1 font-heading text-2xl tracking-tight sm:mt-2 sm:text-3xl">Submit an achievement</h1>
      <p className="mt-1.5 mb-6 max-w-2xl text-xs text-muted-foreground sm:mt-2 sm:mb-8 sm:text-sm">
        Include proof. Core members verify every submission. You will not see individual records or
        points from here — only overall Nexus progress.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Achievement record</CardTitle>
          <CardDescription>
            Required: name, department, date, details, and a valid proof image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AchievementForm
            defaultName={user.name}
            defaultDepartment={user.department}
          />
        </CardContent>
      </Card>
    </div>
  );
}
