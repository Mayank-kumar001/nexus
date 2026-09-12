import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentUser } from "@/lib/session";
import { Suspense } from "react";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-4xl border bg-card p-8 shadow-md ring-1 ring-foreground/5">
        <Brand className="mb-8" />
        <h1 className="font-heading text-2xl font-bold">Sign in</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Sign in with your GitHub account to access the workspace.
        </p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
