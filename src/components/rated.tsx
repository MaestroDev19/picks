import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movies, Tv } from "@/schema";
import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
export default function Top({ movies, tvs }: { movies: Movies[]; tvs: Tv[] }) {
  const path = "https://image.tmdb.org/t/p/original";
  const movie = useMemo(
    () =>
      movies
        .filter(
          (latestMovie) =>
            latestMovie.overview !== "" &&
            latestMovie.tagline !== "" &&
            latestMovie.poster_path !== "" &&
            latestMovie.backdrop_path !== ""
        )
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [movies]
  );
  const tv = useMemo(
    () =>
      tvs
        .filter(
          (latestTv) =>
            latestTv.overview !== "" &&
            latestTv.tagline !== "" &&
            latestTv.poster_path !== "" &&
            latestTv.backdrop_path !== "" &&
            latestTv.type !== "Talk Show"
        )
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [tvs]
  );
  return (
    <Tabs defaultValue="movie" className="">
      <TabsList className="max-w-xl">
        <TabsTrigger value="movie">Movies</TabsTrigger>
        <TabsTrigger value="tv">Tv shows</TabsTrigger>
      </TabsList>

      <TabsContent value="movie">
        <div className="grid gap-[20px] lg:grid-cols-4 md:grid-cols-2 mt-5 w-full ">
          {movie.map((trending) => (
            <Link key={trending.id} href={`/movie/${trending.id} `}>
              <Image
                src={`${path}${trending.poster_path}`}
                height={4000}
                width={300}
                alt={trending.title}
                className="w-full"
              />
              <h3 className="py-5 line-clamp-1 font-medium">
                {trending.title}
              </h3>
            </Link>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="tv">
        <div className="grid gap-[20px] lg:grid-cols-4 md:grid-cols-2 mt-5 w-full ">
          {tv.map((trending) => (
            <Link key={trending.id} href={`/tv/${trending.id} `}>
              <Image
                src={`${path}${trending.poster_path}`}
                height={4000}
                width={300}
                alt={trending.name}
                className="w-full"
              />
              <h3 className="py-5 line-clamp-1 font-medium">{trending.name}</h3>
            </Link>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
