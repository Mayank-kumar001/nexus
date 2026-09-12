import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-40" />
        </div>
      </div>
    </div>
  );
}
