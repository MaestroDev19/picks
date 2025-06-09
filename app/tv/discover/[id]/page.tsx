import { MovieCard } from "@/components/movie-card";
import { discoverTvByGenre, getGenreName, getTvGenreName } from "@/data/data";

export default async function TvDiscoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tv = await discoverTvByGenre(id);
  function getTvDetails(id: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-8 px-8 md:px-10 lg:px-12 py-10">
      <h1 className="text-2xl font-bold">{getTvGenreName(id)}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tv.map((show) => (
          <MovieCard key={show.id} item={show} />
        ))}
      </div>
    </div>
  );
}
