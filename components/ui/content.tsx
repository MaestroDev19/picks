"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trending } from "@/lib/data";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure to import the Skeleton component
import { Popcorn, Star } from "lucide-react";

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
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }
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
          <div className="grid gap-[25px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
            {all.map((trending) => (
              <Suspense
                fallback={<Skeleton className="w-[300px]" />}
                key={trending.id}
              >
                <Link href={`/${trending.media_type}/${trending.id} `}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-100"></div>
                    <Image
                      src={`${path}${trending.poster_path}`}
                      height={400}
                      width={300}
                      alt={trending.name || trending.title}
                      className="w-full"
                    />{" "}
                    <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                      <p className="capitalize text-sm text-muted-foreground">
                        {trending.media_type}
                      </p>
                      <h3 className="line-clamp-1 font-medium text-base">
                        {trending.name || trending.title}
                      </h3>
                      <div className="flex  items-center space-x-1.5">
                        <div
                          className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                        >
                          <div className="flex items-center space-x-1 text-xs">
                            <Star width={12} height={12} />
                            <span>
                              {convertToOneDecimal(trending.vote_average)}
                            </span>
                          </div>
                        </div>
                        <div
                          className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                        >
                          <div className="flex items-center space-x-1 text-xs">
                            <Popcorn width={12} height={12} />
                            <span>
                              {convertToOneDecimal(trending.popularity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Suspense>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="movie">
        <div className="grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
          {movie.map((trending) => (
            <Suspense
              fallback={<Skeleton className="w-[300px]" />}
              key={trending.id}
            >
              <Link href={`/${trending.media_type}/${trending.id} `}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-100"></div>
                  <Image
                    src={`${path}${trending.poster_path}`}
                    height={4000}
                    width={300}
                    alt={trending.name || trending.title}
                    className="w-full"
                  />{" "}
                  <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                    <p className="capitalize text-sm text-muted-foreground">
                      {trending.media_type}
                    </p>
                    <h3 className="line-clamp-1 font-medium text-base">
                      {trending.name || trending.title}
                    </h3>
                    <div className="flex  items-center space-x-1.5">
                      <div
                        className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                      >
                        <div className="flex items-center space-x-1 text-xs">
                          <Star width={12} height={12} />
                          <span>
                            {convertToOneDecimal(trending.vote_average)}
                          </span>
                        </div>
                      </div>
                      <div
                        className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                      >
                        <div className="flex items-center space-x-1 text-xs">
                          <Popcorn width={12} height={12} />
                          <span>
                            {convertToOneDecimal(trending.popularity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Suspense>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="tv">
        <div className="grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
          {tv.map((trending) => (
            <Suspense
              fallback={<Skeleton className="w-[300px]" />}
              key={trending.id}
            >
              <Link href={`/${trending.media_type}/${trending.id} `}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-100"></div>
                  <Image
                    src={`${path}${trending.poster_path}`}
                    height={4000}
                    width={300}
                    alt={trending.name || trending.title}
                    className="w-full"
                  />{" "}
                  <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                    <p className="capitalize text-sm text-muted-foreground">
                      {trending.media_type}
                    </p>
                    <h3 className="line-clamp-1 font-medium text-base">
                      {trending.name || trending.title}
                    </h3>
                    <div className="flex  items-center space-x-1.5">
                      <div
                        className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                      >
                        <div className="flex items-center space-x-1 text-xs">
                          <Star width={12} height={12} />
                          <span>
                            {convertToOneDecimal(trending.vote_average)}
                          </span>
                        </div>
                      </div>
                      <div
                        className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                      >
                        <div className="flex items-center space-x-1 text-xs">
                          <Popcorn width={12} height={12} />
                          <span>
                            {convertToOneDecimal(trending.popularity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Suspense>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
