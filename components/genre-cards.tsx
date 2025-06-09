"use client";
import { useRouter } from "next/navigation";
import { Genre } from "@/data/types";
import { Card, CardHeader } from "@/components/ui/card";
import { Film, Tv } from "lucide-react";

interface GenreCardsProps {
  genres: Genre[];
  mediaType: "movie" | "tv";
  className?: string;
}

// Genre colors for visual variety
const genreColors = [
  "bg-red-500/10 hover:bg-red-500/20 text-red-500",
  "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500",
  "bg-green-500/10 hover:bg-green-500/20 text-green-500",
  "bg-purple-500/10 hover:bg-purple-500/20 text-purple-500",
  "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500",
  "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500",
  "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500",
  "bg-orange-500/10 hover:bg-orange-500/20 text-orange-500",
];

export function GenreCards({
  genres,
  mediaType,
  className = "",
}: GenreCardsProps) {
  const router = useRouter();

  const handleGenreClick = (genreId: number) => {
    router.push(`/${mediaType}/discover/${genreId}`);
  };

  return (
    <div
      className={`grid sm:grid-cols- md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
    >
      {genres.map((genre, index) => (
        <Card
          key={genre.id}
          className={` bg-secondary/50 cursor-pointer transition-colors duration-200`}
          onClick={() => handleGenreClick(genre.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
            <div>
              <h3 className="font-semibold">{genre.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Browse {genre.name}{" "}
                {mediaType === "movie" ? "Movies" : "TV Shows"}
              </p>
            </div>
            {mediaType === "movie" ? (
              <Film className="w-6 h-6 text-primary" />
            ) : (
              <Tv className="w-6 h-6 text-primary" />
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
