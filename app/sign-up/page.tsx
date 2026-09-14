import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/session";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-4xl border bg-card p-8 shadow-md ring-1 ring-foreground/5">
        <Brand className="mb-8" />
        <h1 className="font-heading text-2xl font-bold">Create your account</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Create your central Supabase account with email and password.
        </p>
        <SignUpForm />
      </div>
    </div>
  );
}
