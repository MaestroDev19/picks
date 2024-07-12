"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export const loginWithGoogle = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");
  const { data: google, error: googleError } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  if (google.url) {
    console.log(google.url);
    redirect(google.url); // use the redirect API for your server framework
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
