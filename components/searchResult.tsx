"use client";

import { Trending } from "@/lib/data";
import Link from "next/link";
import { Star, Popcorn } from "lucide-react";
import path from "path";
import { Suspense, useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

export function Result({ result }: { result: Trending[] }) {
  const path = "https://image.tmdb.org/t/p/original";
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }
  const searchResult = useMemo(
    () =>
      result
        .filter(
          (trending: Trending) =>
            trending.overview !== "" &&
            trending.tagline !== "" &&
            trending.poster_path !== null &&
            trending.backdrop_path !== null
        )
        .filter(
          (trending: Trending) =>
            trending.media_type === "movie" || trending.media_type === "tv"
        )
        .sort((a: Trending, b: Trending) => b.popularity - a.popularity)
        .sort((a: Trending, b: Trending) => b.vote_average - a.vote_average),
    [result]
  );
  return (
    <div className="grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
      {searchResult.map((trending: Trending) => (
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
              />
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
                      <span>{convertToOneDecimal(trending.vote_average)}</span>
                    </div>
                  </div>
                  <div
                    className=" w-fit py-1 px-1.5 rounded bg-white shadow-lg  bg-clip-padding bg-opacity-15  border-gray-200
                          backdrop-filter: blur(20px);"
                  >
                    <div className="flex items-center space-x-1 text-xs">
                      <Popcorn width={12} height={12} />
                      <span>{convertToOneDecimal(trending.popularity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Suspense>
      ))}
    </div>
  );
}
