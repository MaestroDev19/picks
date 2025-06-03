import { getTvDetails } from "@/data/data";
import { Details } from "@/components/details";
import { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const tv = await getTvDetails(params.id);
  return {
    title: `${tv.name} : Picks - Your collection of best tv shows and movies`,
    description: tv.overview,
  };
}
export default async function TvDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const tv = await getTvDetails(id);
  return <Details item={tv} />;
}
