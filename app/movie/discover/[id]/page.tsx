import { MovieCard } from "@/components/movie-card";
import { discoverMoviesByGenre, getMovieGenreName } from "@/data/data";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export default async function MovieDiscoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movies = await discoverMoviesByGenre(id);
  const genreName = getMovieGenreName(id);

  return (
    <div className="space-y-8 px-8 md:px-10 lg:px-12 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{genreName} </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} item={movie} />
        ))}
      </div>
    </div>
  );
}
