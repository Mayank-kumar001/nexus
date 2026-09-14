"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { authClient, ensureCentralProfile } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") || "/dashboard";
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signInGithub() {
    setPending(true);
    await authClient.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${window.location.origin}${next}` } });
    setPending(false);
  }

  async function signInEmail() {
    setPending(true);
    setError("");
    const { error: signInError } = await authClient.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }
    const { data: { user } } = await authClient.auth.getUser();
    if (user) {
      const { error: profileError } = await ensureCentralProfile(user);
      if (profileError) {
        setError(`Signed in, but your team profile could not be created: ${profileError.message}`);
        setPending(false);
        return;
      }
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={signInEmail} className="flex flex-col gap-3">
        <input type="email" required placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl border bg-input/50 px-3 text-sm" />
        <input type="password" required placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-xl border bg-input/50 px-3 text-sm" />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      </form>
      <div className="text-center text-xs text-muted-foreground">or</div>
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

