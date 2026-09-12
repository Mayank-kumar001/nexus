"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [pending, setPending] = useState(false);

  async function signInGithub() {
    setPending(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: next,
    });
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Button
        type="button"
        className="w-full bg-white text-black hover:bg-white/90 font-medium py-6 text-sm"
        disabled={pending}
        onClick={signInGithub}
      >
        <GithubLogoIcon className="size-5" data-icon="inline-start" />
        {pending ? "Redirecting…" : "Continue with GitHub"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to the team?{" "}
        <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

