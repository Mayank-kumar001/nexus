import type { getTeamProgress } from "@/lib/leaderboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Progress = Awaited<ReturnType<typeof getTeamProgress>>;

export function TeamProgress({ data }: { data: Progress }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Nexus progress</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Ranked by verified achievements by department. Individual names and points are not shown
            here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3.5 sm:gap-4">
          {data.departmentRows.every((row) => row.verifiedCount === 0) ? (
            <p className="text-xs sm:text-sm text-muted-foreground">
              No verified records yet. Submit work, then wait for Core review.
            </p>
          ) : (
            data.departmentRows.map((row) => (
              <div key={row.department} className="grid grid-cols-[2.25rem_1fr] items-center gap-2.5 sm:grid-cols-[3rem_1fr] sm:gap-3">
                <span className="font-heading text-base sm:text-lg tabular-nums text-muted-foreground">
                  {String(row.rank).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium truncate pr-2">{row.department}</span>
                    <span className="tabular-nums text-muted-foreground shrink-0 text-xs sm:text-sm">
                      {row.verifiedCount} verified
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${row.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Journey progress</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Official counts after Core verification.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl border border-border/50 bg-muted/20 p-3 sm:p-4">
            <p className="text-2xl sm:text-3xl font-heading tabular-nums">{data.verifiedTotal}</p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">Verified</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/20 p-3 sm:p-4">
            <p className="text-2xl sm:text-3xl font-heading tabular-nums">{data.pendingTotal}</p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">In review</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
