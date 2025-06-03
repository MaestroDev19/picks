import { getMovieDetails } from "@/data/data";
import { Details } from "@/components/details";
import { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const movie = await getMovieDetails(params.id);
  return {
    title: `${movie.title} : Picks - Your collection of best tv shows and movies`,
    description: movie.overview,
  };
}
export default async function MovieDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const movie = await getMovieDetails(id);
  return <Details item={movie} />;
}
