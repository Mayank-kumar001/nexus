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
        <input type="email" required placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-[56px] rounded-[8px] bg-white border border-[#dddddd] px-4 text-[16px] text-[#222222] placeholder:text-[#6a6a6a] focus:outline-none focus:border-2 focus:border-[#222222]" />
        <input type="password" required placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-[56px] rounded-[8px] bg-white border border-[#dddddd] px-4 text-[16px] text-[#222222] placeholder:text-[#6a6a6a] focus:outline-none focus:border-2 focus:border-[#222222]" />
        {error ? <p className="text-sm text-[#c13515]">{error}</p> : null}
        <Button type="submit" disabled={pending} className="h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-white font-medium text-[16px] border-none mt-3">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="text-center text-[12px] text-[#6a6a6a]">or</div>
      <Button
        type="button"
        className="h-12 rounded-[8px] bg-white border border-[#222222] hover:bg-[#f7f7f7] text-[#222222] font-medium text-[16px]"
        disabled={pending}
        onClick={signInGithub}
      >
        <GithubLogoIcon className="size-5 mr-2" />
        {pending ? "Redirecting…" : "Continue with GitHub"}
      </Button>
      <p className="text-center text-[14px] text-[#222222]">
        New to the team?{" "}
        <Link href="/sign-up" className="text-[#222222] font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

