import { getMovieGenres } from "@/data/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenreCards } from "@/components/genre-cards";

export default async function MoviePage() {
  const genres = await getMovieGenres();
  console.log(genres);
  return (
    <div className="flex flex-col gap-4 px-8 md:px-10 lg:px-12 py-10">
      <GenreCards genres={genres} mediaType="movie" />
    </div>
  );
}
