import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { HomeAnimatedContent } from "@/components/home-animated-content";

export default async function Home() {
  const user = await getCurrentUser();

  return <HomeAnimatedContent isLoggedIn={!!user} />;
}
