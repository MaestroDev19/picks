import { GenreCards } from "@/components/genre-cards";
import { getTvGenres } from "@/data/data";

export default async function TvPage() {
  const genres = await getTvGenres();
  console.log(genres);
  return (
    <div className="flex flex-col gap-4 px-8 md:px-10 lg:px-12 py-10">
      <GenreCards genres={genres} mediaType="tv" />
    </div>
  );
}
