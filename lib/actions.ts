"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export const loginWithGoogle = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during Google sign-in:", error);
    // Handle the error appropriately
    return;
  }

  if (data?.url) {
    // Instead of using redirect, return the URL
    return data.url;
  }
};

export async function fetchProfileData() {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single();
  if (error || !data) {
  }
  return data;
}
