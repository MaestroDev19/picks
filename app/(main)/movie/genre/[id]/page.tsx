import Rated from "@/components/rated";
import { Skeleton } from "@/components/ui/skeleton";
import { Movies } from "@/lib/data";
import { Star, Popcorn } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

export default async function Genre({ params }: { params: { id: string } }) {
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }
  const key = process.env.API_KEY;
  const path = "https://image.tmdb.org/t/p/original";
  const [id, title] = params.id.split("-");
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${key}&include_adult=false&with_genres=${id}`
  );
  const movies = await response.json();
  const movie: Movies[] = movies.results;
  console.log(movie);
  return (
    <main className="min-h-dvh">
      <div className="px-5 md:px-10 lg:px-20 my-20 grid gap-y-20">
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl capitalize text-muted-foreground font-semibold">
            {title}
          </h2>
          <div className="grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-5 w-full ">
            {movie
              .filter(
                (trending) =>
                  trending.overview !== "" &&
                  trending.tagline !== "" &&
                  trending.poster_path !== "" &&
                  trending.backdrop_path !== ""
              )
              .sort((a, b) => b.popularity - a.popularity)
              .sort((a, b) => b.vote_average - a.vote_average)
              .map((trending) => (
                <Suspense
                  fallback={<Skeleton className="w-[300px]" />}
                  key={trending.id}
                >
                  <Link href={`/movie/${trending.id} `}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 opacity-100"></div>
                      <Image
                        src={`${path}${trending.poster_path}`}
                        height={4000}
                        width={300}
                        alt={trending.title}
                        className="w-full"
                      />
                      <div className="absolute bottom-0 inset-x-0 text-white p-5 space-y-1.5">
                        <p className="capitalize text-sm text-muted-foreground">
                          movie
                        </p>
                        <h3 className="line-clamp-1 font-medium text-base">
                          {trending.title}
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
      </div>
    </main>
  );
}
