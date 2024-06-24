"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useMemo } from "react";
import { Trending } from "@/lib/data";
import { Check, Minus, Plus, Popcorn, Star } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import { useSetAtom, useAtomValue, useAtom, useStore } from "jotai";
import { myListFlow } from "@/lib/store";
const path = "https://image.tmdb.org/t/p/original";

export function Slider({ content }: { content: Trending[] }) {
  const [watchlist, setWatchlist] = useAtom(myListFlow, {
    store: useStore(),
  });
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }

  const filtered: Trending[] = useMemo(
    () =>
      content
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
  const handleAddToWatchlistMovie = (item: Trending) => {
    setWatchlist((prev) => {
      const alreadyInWatchlist = prev.movies.some(
        (movie) => movie.id === item.id
      );
      if (alreadyInWatchlist) {
        console.log("Movie is already in the watchlist.");
        return prev;
      }
      return {
        ...prev,
        movies: [
          ...prev.movies,
          {
            vote_average: item.vote_average,
            popularity: item.popularity,
            id: item.id,
            title: item.title,
            poster_path: item.poster_path,
            media_type: item.media_type,
          },
        ],
      };
    });
    console.log("Added movie to watchlist: ", item);
  };

  const handleAddToWatchlistTV = (item: Trending) => {
    setWatchlist((prev) => {
      const alreadyInWatchlist = prev.tvShows.some(
        (tvShow) => tvShow.id === item.id
      );
      if (alreadyInWatchlist) {
        console.log("TV show is already in the watchlist.");
        return prev;
      }
      return {
        ...prev,
        tvShows: [
          ...prev.tvShows,
          {
            vote_average: item.vote_average,
            popularity: item.popularity,
            id: item.id,
            name: item.name,
            poster_path: item.poster_path,
            media_type: item.media_type,
          },
        ],
      };
    });
    console.log("Added TV show to watchlist: ", item);
  };
  const handleRemoveFromWatchlist = (item: Trending) => {
    setWatchlist((prev) => ({
      ...prev,
      movies: prev.movies.filter((movie) => movie.id !== item.id),
      tvShows: prev.tvShows.filter((tvShow) => tvShow.id !== item.id),
    }));
    console.log("Removed from watchlist: ", item);
  };

  const isInwatchList = (item: Trending) => {
    return (
      watchlist.movies.some((movie) => movie.id === item.id) ||
      watchlist.tvShows.some((tvShow) => tvShow.id === item.id)
    );
  };
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
        }),
      ]}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {filtered.map((trending) => (
          <CarouselItem key={trending.id} className="-pl-2 md:-pl-4">
            <div className="w-full h-[700px] mx-auto flex items-center relative">
              <Image
                src={`${path}${trending.backdrop_path}`}
                width={4000}
                height={300}
                alt={trending.name || trending.title}
                className="w-full h-full object-cover"
                priority={true}
              />
              <div className="absolute inset-0 bg-zinc-950 opacity-65"></div>
              <div className="w-full px-[25px] md:px-[50px] lg:px-[100px] flex flex-col space-y-8 absolute text-white">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-semibold">
                    {trending.name || trending.title}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p></p>
                    <div className="flex items-center space-x-1">
                      <Star width={16} height={16} />
                      <span>{convertToOneDecimal(trending.vote_average)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Popcorn width={16} height={16} />
                      <span>{convertToOneDecimal(trending.popularity)}</span>
                    </div>
                  </div>
                  <p className="md:max-w-xl line-clamp-2 text-sm lg:text-base ">
                    {trending.overview}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="rounded-none" asChild>
                    <Link
                      href={`/${trending.media_type}/${trending.id}`}
                      className="font-medium"
                    >
                      View more
                    </Link>
                  </Button>
                  {isInwatchList(trending) ? (
                    <Button
                      className="rounded-none font-medium"
                      variant={"secondary"}
                      onClick={() => handleRemoveFromWatchlist(trending)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Added
                    </Button>
                  ) : (
                    <Button
                      className="rounded-none"
                      variant={"secondary"}
                      onClick={() => {
                        if (trending.media_type === "movie") {
                          handleAddToWatchlistMovie(trending);
                        } else if (trending.media_type === "tv") {
                          handleAddToWatchlistTV(trending);
                        }
                      }}
                    >
                      Add to list
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
