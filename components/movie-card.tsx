"use client";
import type { Movies, Trending, TvShows } from "@/data/types";
import { useRouter } from "next/navigation";
import { Star, Popcorn } from "lucide-react";
import { convertToDecimal } from "@/lib/func";

interface MovieCardProps {
  item: Trending | Movies | TvShows;
  aspectRatio?: "portrait" | "square" | "video";
  width?: number;
  height?: number;
}

export function MovieCard({
  item,
  aspectRatio = "portrait",
  width,
  height,
}: MovieCardProps) {
  const route = useRouter();
  // Determine aspect ratio class
  const aspectRatioClass = {
    portrait: "aspect-[2/3]",
    square: "aspect-square",
    video: "aspect-video",
  }[aspectRatio];

  // Get title based on media type
  const title =
    "name" in item ? item.name : "title" in item ? item.title : "Unknown Title";

  // Get media type
  const mediaType = "name" in item ? "tv" : "movie";

  // Get release year if available
  const releaseDate =
    "release_date" in item
      ? item.release_date
      : "first_air_date" in item
      ? item.first_air_date
      : "";
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div
      className="group block w-full"
      onClick={() => route.push(`/${mediaType}/${item.id}`)}
    >
      <div className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 w-full">
        {/* Movie poster */}
        <div className={`relative ${aspectRatioClass} overflow-hidden w-full`}>
          {item.poster_path ? (
            <img
              src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${item.poster_path}`}
              alt={title}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-xs sm:text-sm text-gray-400">No image</span>
            </div>
          )}

          {/* Gradient overlay - always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 text-white p-2 sm:p-3 space-y-0.5 sm:space-y-1">
            {/* Rating badges */}
            <div className="flex items-center space-x-1.5">
              {/* Star rating badge */}
              <div className="w-fit py-0.5 sm:py-1 px-1 sm:px-1.5 rounded-sm bg-black/40 backdrop-blur-sm">
                <div className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                  <span className="font-medium">
                    {convertToDecimal(item.vote_average || 0)}
                  </span>
                </div>
              </div>

              {/* Popularity badge */}
              <div className="w-fit py-0.5 sm:py-1 px-1 sm:px-1.5 rounded-sm bg-black/40 backdrop-blur-sm">
                <div className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs">
                  <Popcorn className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                  <span className="font-medium">
                    {convertToDecimal(item.popularity || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="line-clamp-1 font-medium text-xs sm:text-sm">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
