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
      <div className="w-full max-w-md rounded-[14px] bg-white border border-[#dddddd] p-8 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
        <Brand className="mb-8" />
        <h1 className="text-[24px] font-semibold text-[#222222]">Sign in</h1>
        <p className="mt-2 mb-8 text-[16px] text-[#6a6a6a]">
          Sign in with your central Supabase account to access the workspace.
        </p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
