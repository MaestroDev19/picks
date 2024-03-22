import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trending } from "@/schema";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
export default function Content({
  content,
  movieContent,
  tvContent,
}: {
  content: Trending[];
  movieContent: Trending[];
  tvContent: Trending[];
}) {
  const path = "https://image.tmdb.org/t/p/original";
  const all = useMemo(
    () =>
      content

        .filter(
          (trending) =>
            trending.overview !== "" &&
            trending.tagline !== "" &&
            trending.poster_path !== "" &&
            trending.backdrop_path !== ""
        )
        .filter(
          (trending) =>
            trending.media_type === "movie" || trending.media_type === "tv"
        )
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [content]
  );
  const movie = useMemo(
    () =>
      movieContent
        .filter((trending) => trending.media_type === "movie")
        .filter(
          (trending) =>
            trending.overview !== "" &&
            trending.tagline !== "" &&
            trending.poster_path !== "" &&
            trending.backdrop_path !== ""
        )
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [movieContent]
  );
  const tv = useMemo(
    () =>
      tvContent
        .filter((trending) => trending.media_type === "tv")
        .filter(
          (trending) =>
            trending.overview !== "" &&
            trending.tagline !== "" &&
            trending.poster_path !== "" &&
            trending.backdrop_path !== ""
        )
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [tvContent]
  );

  return (
    <Tabs defaultValue="all" className="">
      <TabsList className="max-w-xl">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="movie">Movies</TabsTrigger>
        <TabsTrigger value="tv">Tv shows</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="flex w-full">
          <div className="grid gap-[20px] lg:grid-cols-4 md:grid-cols-2 mt-5 w-full ">
            <Suspense fallback={<Skeleton />}>
              {all.map((trending) => (
                <Link
                  key={trending.id}
                  href={`/${trending.media_type}/${trending.id} `}
                >
                  <Image
                    src={`${path}${trending.poster_path}`}
                    height={4000}
                    width={300}
                    alt={trending.name || trending.title}
                    className="w-full"
                  />
                  <h3 className="py-5 line-clamp-1 font-medium">
                    {trending.name || trending.title}
                  </h3>
                </Link>
              ))}
            </Suspense>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="movie">
        <div className="grid gap-[20px] lg:grid-cols-4 md:grid-cols-2 mt-5 w-full ">
          {movie.map((trending) => (
            <Link
              key={trending.id}
              href={`/${trending.media_type}/${trending.id} `}
            >
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
            <Link
              key={trending.id}
              href={`/${trending.media_type}/${trending.id} `}
            >
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
