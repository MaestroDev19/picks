import Link from "next/link"
import type { Movies, Trending, TvShows } from "@/data/types"

import { Star, Popcorn, Info, Plus, Play } from "lucide-react"
import { convertToDecimal } from "@/lib/func"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

interface MovieCardProps {
  item: Trending | Movies | TvShows
  aspectRatio?: "portrait" | "square" | "video"
  width?: number
  height?: number
}

export function MovieCard({ item, aspectRatio = "portrait", width, height }: MovieCardProps) {
  // Determine aspect ratio class
  const aspectRatioClass = {
    portrait: "aspect-[2/3]",
    square: "aspect-square",
    video: "aspect-video",
  }[aspectRatio]

  // Get title based on media type
  const title = "name" in item ? item.name : "title" in item ? item.title : "Unknown Title"

  // Get media type
  const mediaType = "media_type" in item ? item.media_type : "Unknown"

  // Get release year if available
  const releaseDate = "release_date" in item ? item.release_date : "first_air_date" in item ? item.first_air_date : ""
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    <div className="group block w-full">
      <Drawer>
        <DrawerTrigger asChild>
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
                      <span className="font-medium">{convertToDecimal(item.vote_average || 0)}</span>
                    </div>
                  </div>

                  {/* Popularity badge */}
                  <div className="w-fit py-0.5 sm:py-1 px-1 sm:px-1.5 rounded-sm bg-black/40 backdrop-blur-sm">
                    <div className="flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs">
                      <Popcorn className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                      <span className="font-medium">{convertToDecimal(item.popularity || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="line-clamp-1 font-medium text-xs sm:text-sm">{title}</h3>
              </div>
            </div>
          </div>
        </DrawerTrigger>

        <DrawerContent className="bg-zinc-900 border-t border-zinc-800 max-h-[90vh] overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
              <DrawerTitle className="text-xl sm:text-2xl font-bold text-white line-clamp-2">{title}</DrawerTitle>
              {releaseYear && <p className="text-gray-400 text-xs sm:text-sm mt-1">{releaseYear}</p>}
            </DrawerHeader>

            <div className="p-4 sm:p-6 pt-1 sm:pt-2">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Poster in drawer */}
                <div className="w-1/3 sm:w-1/3 lg:w-1/4 mx-auto sm:mx-0">
                  {item.poster_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${item.poster_path}`}
                      alt={title}
                      className="w-full rounded-md shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center rounded-md">
                      <span className="text-xs sm:text-sm text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="w-full sm:w-2/3 lg:w-3/4 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
                        {convertToDecimal(item.vote_average || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Popcorn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
                        {convertToDecimal(item.popularity || 0)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                      {item.genres?.map((genre: { id: string; name: string }) => (
                        <span
                          key={genre.id}
                          className="px-1.5 py-0.5 rounded-full bg-zinc-800 text-[10px] sm:text-xs text-gray-300"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.overview && (
                    <p className="text-gray-300 mt-1 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm md:text-base">
                      {item.overview}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-3 sm:mt-6">
                    <Button className=" text-white font-medium px-3 sm:px-6 py-1 h-8 sm:h-10 text-xs sm:text-sm" variant={'default'}>
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Add to Watchlist
                    </Button>
                    <Button
                      variant="secondary"
                      className="border-zinc-700 text-white hover:bg-zinc-800 h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Watch Trailer
                    </Button>
                    

                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="sm:px-6 px-4 py-2 sm:py-4 border-t border-zinc-800">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-zinc-800 w-full sm:w-auto text-xs sm:text-sm"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
