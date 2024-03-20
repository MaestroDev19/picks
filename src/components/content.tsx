import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trending } from "@/schema";
import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
export default function Content({ content }: { content: Trending[] }) {
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
      content
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
    [content]
  );
  const tv = useMemo(
    () =>
      content
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
    [content]
  );
  console.log(all);
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
            {all.map((trending) => (
              <Link
                className="w-fit h-fit "
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
              </Link>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="movie"></TabsContent>
      <TabsContent value="tv">Change your password here.</TabsContent>
    </Tabs>
  );
}
