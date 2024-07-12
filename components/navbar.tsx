import { Nav } from "./nav";
import { AuthNav } from "./authNav";
import { fetchProfileData } from "@/lib/actions";

export default async function Navbar() {
  const data = await fetchProfileData();

  return (
    <>
      {data ? (
        <AuthNav name={data.full_name} avatar={data.avatar_url} />
      ) : (
        <Nav />
      )}{" "}
    </>
  );
}
