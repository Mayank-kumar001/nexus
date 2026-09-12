import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import { requireCore } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function ReviewPage() {
  await requireCore();
  const pending = await prisma.achievement.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <div className="mb-8">
        <p className="text-xs tracking-[0.24em] text-primary uppercase">Core</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Verification queue</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review proof before a record can enter the official AARVAK Point System.
        </p>
      </div>
      {pending.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Queue is clear</EmptyTitle>
            <EmptyDescription>No submissions are waiting for verification.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4">
          {pending.map((item) => (
            <Link key={item.id} href={`/review/${item.id}`}>
              <Card className="transition-colors hover:bg-muted/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{item.memberName}</CardTitle>
                      <CardDescription>
                        {item.department} · {format(item.achievedOn, "d MMM yyyy")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.details}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
