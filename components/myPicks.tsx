"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movies, Trending, Tv } from "@/lib/data";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure to import the Skeleton component
import { Popcorn, Star, Trash2 } from "lucide-react";
import { myListFlow, WatchlistItem } from "@/lib/store";
import { useAtom, useAtomValue, useStore } from "jotai";
import { Button } from "./ui/button";

export default function MyPicks() {
  const [watchlist, setWatchlist] = useAtom(myListFlow, {
    store: useStore(),
  });
  const handleRemoveFromWatchlistMovie = (item: WatchlistItem) => {
    setWatchlist((prev) => ({
      ...prev,
      movies: prev.movies.filter((movie) => movie.id !== item.id),
    }));
    console.log("Removed from watchlist: ", item);
  };

  const handleRemoveFromWatchlistTV = (item: WatchlistItem) => {
    setWatchlist((prev) => ({
      ...prev,
      tvShows: prev.tvShows.filter((tv) => tv.id !== item.id),
    }));
    console.log("Removed from watchlist: ", item);
  };

  const path = "https://image.tmdb.org/t/p/original";
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }

  const movie = useMemo(
    () =>
      watchlist.movies

        .filter((trending) => trending.poster_path !== "")
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [watchlist.movies]
  );

  const tv = useMemo(
    () =>
      watchlist.tvShows

        .filter((trending) => trending.poster_path !== "")
        .sort((a, b) => b.popularity - a.popularity)
        .sort((a, b) => b.vote_average - a.vote_average),
    [watchlist.tvShows]
  );

  return (
    <Tabs defaultValue="movie" className="">
      <TabsList className="max-w-xl">
        <TabsTrigger value="movie">Movies</TabsTrigger>
        <TabsTrigger value="tv">Tv shows</TabsTrigger>
      </TabsList>

      <TabsContent value="movie">
        <div className="grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
          {movie?.map((trending) => (
            <Suspense
              fallback={<Skeleton className="w-[300px]" />}
              key={trending?.id}
            >
              <div className="relative">
                <Button
                  className="absolute top-2 right-2 z-30"
                  variant={"secondary"}
                  size={"icon"}
                  onClick={() => handleRemoveFromWatchlistMovie(trending)}
                >
                  <Trash2 height={16} width={16} />
                </Button>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-50"></div>
                <Image
                  src={`${path}${trending?.poster_path}`}
                  height={4000}
                  width={300}
                  alt={trending?.title || ""}
                  className="w-full"
                />{" "}
                <Link href={`/movie/${trending?.id} `}>
                  <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                    <p className="capitalize text-sm text-muted-foreground">
                      movie
                    </p>
                    <h3 className="line-clamp-1 font-medium text-base">
                      {trending?.title}
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
                            {convertToOneDecimal(trending.popularity || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </Link>
              </div>
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
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-100"></div>
                <Button
                  className="absolute top-2 right-2 z-30"
                  variant={"secondary"}
                  size={"icon"}
                  onClick={() => handleRemoveFromWatchlistTV(trending)}
                >
                  <Trash2 height={16} width={16} />
                </Button>
                <Image
                  src={`${path}${trending.poster_path}`}
                  height={4000}
                  width={300}
                  alt={trending.name || ""}
                  className="w-full"
                />{" "}
                <Link href={`/tv/${trending.id} `}>
                  <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                    <p className="capitalize text-sm text-muted-foreground">
                      tv
                    </p>
                    <h3 className="line-clamp-1 font-medium text-base">
                      {trending.name}
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
                </Link>
              </div>
            </Suspense>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
