import { prisma } from "./db";
import { DEPARTMENTS } from "./constants";

export async function getTeamProgress() {
  const [verifiedByDepartment, totals] = await Promise.all([
    prisma.achievement.groupBy({
      by: ["department"],
      where: { status: "VERIFIED" },
      _count: { _all: true },
    }),
    prisma.achievement.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countFor = (status: "PENDING" | "VERIFIED" | "REJECTED") =>
    totals.find((row) => row.status === status)?._count._all ?? 0;

  const verifiedTotal = countFor("VERIFIED");
  const pendingTotal = countFor("PENDING");

  const departmentRows = [...DEPARTMENTS]
    .map((department) => ({
      department,
      verifiedCount:
        verifiedByDepartment.find((row) => row.department === department)?._count._all ?? 0,
    }))
    .sort((a, b) => b.verifiedCount - a.verifiedCount);

  const maxDepartmentCount = Math.max(1, ...departmentRows.map((row) => row.verifiedCount));

  return {
    verifiedTotal,
    pendingTotal,
    departmentRows: departmentRows.map((row, index) => ({
      ...row,
      rank: index + 1,
      progress: Math.round((row.verifiedCount / maxDepartmentCount) * 100),
    })),
  };
}
