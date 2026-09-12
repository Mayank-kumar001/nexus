import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./db";
import { isCoreEmail, USER_ROLES, type UserRole } from "./roles";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  department: string | null;
  team: string | null;
};

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) return null;

  const role: UserRole = isCoreEmail(dbUser.email)
    ? USER_ROLES.CORE
    : dbUser.role === USER_ROLES.CORE
      ? USER_ROLES.CORE
      : USER_ROLES.MEMBER;

  if (role !== dbUser.role) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role },
    });
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
    role,
    department: dbUser.department,
    team: dbUser.team,
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireCore() {
  const user = await requireUser();
  if (user.role !== USER_ROLES.CORE) redirect("/dashboard");
  return user;
}
