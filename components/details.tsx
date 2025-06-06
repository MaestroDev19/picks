import type { Movies, TvShows, BaseMediaItem } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play, Heart, Share2, Star, Clock, Calendar, Tv } from "lucide-react";
import { convertToDecimal } from "@/lib/func";

interface DetailsProps {
  item: Movies | TvShows;
}

export function Details({ item }: DetailsProps) {
  // Get title based on media type
  const title = "name" in item ? item.name : item.title;

  // Get media type
  const mediaType = "name" in item ? "tv" : "movie";

  // Get release date based on media type
  const releaseDate =
    "release_date" in item ? item.release_date : item.first_air_date;
  const formattedDate = new Date(releaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format duration (runtime for movies, episodes for TV shows)
  const getDuration = () => {
    if ("runtime" in item) {
      const hours = Math.floor(item.runtime / 60);
      const minutes = item.runtime % 60;
      return `${hours}h ${minutes}m`;
    } else if ("number_of_episodes" in item) {
      return `${item.number_of_seasons} Seasons `;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
        {item.backdrop_path ? (
          <img
            src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-400">No backdrop available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Left Column - Poster */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            {item.poster_path ? (
              <img
                src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${item.poster_path}`}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
                <span className="text-gray-400">No poster available</span>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8">
          {/* Title and Badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.genres?.map((genre) => (
                <Badge
                  className="text-xs font-normal px-2 py-1"
                  key={genre.id}
                  variant="secondary"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-base font-medium">
                {convertToDecimal(item.vote_average)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {"runtime" in item && (
                <>
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-base">{getDuration()}</span>
                </>
              )}
              {"number_of_episodes" in item && (
                <>
                  <Tv className="w-5 h-5 text-gray-400" />
                  <span className="text-base">{getDuration()}</span>

                  <span className="text-base">
                    {item.number_of_episodes} Episodes
                  </span>
                </>
              )}
            </div>
            {"release_date" in item && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-base text-gray-400">{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
            <Button size="lg" variant="secondary">
              <Heart className="w-5 h-5 mr-2" />
              Add to Favorites
            </Button>
          </div>

          <Separator />

          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-lg leading-relaxed text-gray-400">
              {item.overview}
            </p>
          </div>

          {/* Additional Details */}
          <Card>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
              <div>
                <h3 className="font-medium text-gray-400">Status</h3>
                <p className="mt-1 text-lg">{item.status}</p>
              </div>
              {item.homepage && (
                <div>
                  <h3 className="font-medium text-gray-400">Website</h3>
                  <a
                    href={item.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-lg text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-400">Popularity</h3>
                <p className="mt-1 text-lg">
                  {convertToDecimal(item.popularity)}
                </p>
              </div>

              {/* TV Show specific information */}
              {"networks" in item && item.networks.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-400">Network</h3>
                  <div className="mt-1 flex items-center gap-2">
                    {item.networks[0].logo_path ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${item.networks[0].logo_path}`}
                        alt={item.networks[0].name}
                        className="h-6 object-contain"
                      />
                    ) : (
                      <span className="text-lg">{item.networks[0].name}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
