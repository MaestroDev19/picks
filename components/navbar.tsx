import { Nav } from "./nav";
import { AuthNav } from "./authNav";
import { fetchProfileData } from "@/lib/actions";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return <Nav />;
  }
  const profile = await fetchProfileData();

  return <AuthNav name={profile.full_name} avatar={profile.avatar_url} />;
}
