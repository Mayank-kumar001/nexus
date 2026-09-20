"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, ensureCentralProfile } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function signUpEmail() {
    setPending(true);
    setError("");
    const { data, error: signUpError } = await authClient.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    if (signUpError) {
      setError(signUpError.message);
      setPending(false);
      return;
    }
    if (data.user && data.session) {
      const { error: profileError } = await ensureCentralProfile(data.user);
      if (profileError) {
        setError(`Account created, but your team profile could not be created: ${profileError.message}`);
        setPending(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setError("Account created. Check your email to confirm your account, then sign in.");
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <input type="email" required placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-[56px] rounded-[8px] bg-white border border-[#dddddd] px-4 text-[16px] text-[#222222] placeholder:text-[#6a6a6a] focus:outline-none focus:border-2 focus:border-[#222222]" />
      <input type="password" required minLength={8} placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-[56px] rounded-[8px] bg-white border border-[#dddddd] px-4 text-[16px] text-[#222222] placeholder:text-[#6a6a6a] focus:outline-none focus:border-2 focus:border-[#222222]" />
      {error ? <p className="text-sm text-[#c13515]">{error}</p> : null}
      <Button type="button" disabled={pending} onClick={signUpEmail} className="h-12 rounded-[8px] bg-[#ff385c] hover:bg-[#e00b41] text-white font-medium text-[16px] border-none mt-2">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-[14px] text-[#222222]">
        Already registered?{" "}
        <Link href="/sign-in" className="text-[#222222] font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

