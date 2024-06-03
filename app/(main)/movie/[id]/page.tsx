import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import Image from "next/image";
import { Movies, Video } from "@/lib/data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Popcorn, Star, icons } from "lucide-react";

export default async function Page({ params }: { params: { id: string } }) {
  const key = process.env.API_KEY;
  const path = "https://image.tmdb.org/t/p/original";
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${key}`
  );
  const result = await videoRes.json();
  const videos = result.results as Video[];
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${key}`
  );
  const details = (await response.json()) as Movies;
  const trailer =
    videos.filter((video) => video.type == "Trailer")[0] || "dQw4w9WgXcQ";
  function convertToOneDecimal(trendingVoteAverage: number): number {
    const decimalPart = trendingVoteAverage.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return Math.round(trendingVoteAverage * 10) / 10;
    } else {
      return trendingVoteAverage;
    }
  }
  return (
    <>
      <section>
        {" "}
        <div className="w-full h-[600px] ">
          <iframe
            width="560"
            height="315"
            title="YouTube video player"
            src={`https://www.youtube.com/embed/${
              trailer.key || trailer
            }?si=FGXLUKs0JdCHVD7l&autoplay=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full object-cover"
          />{" "}
        </div>
        <div className="my-20 px-5 md:px-10 lg:px-20 grid gap-y-10">
          <div className="space-y-5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/movie">Movie</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
              {details.title}
            </h1>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="sm:w-5/6 md:w-full lg:w-4/6  relative">
              <Image
                src={`${path}${details.poster_path}`}
                width={4000}
                height={300}
                alt={details.title}
                className="w-full "
              />
              <div className="absolute inset-0 bg-zinc-950 opacity-35"></div>
            </div>
            <div className="space-y-5">
              <h3 className="lg:text-2xl md:text-xl text-lg font-medium  text-muted-foreground">
                {details.tagline}
              </h3>
              <p className="text-sm md:text-base lg:text-lg leading-loose">
                {details.overview}
              </p>
              <div className="flex items-center space-x-2">
                {" "}
                <div className="flex items-center space-x-1">
                  <Star width={16} height={16} />{" "}
                  <span className="text-sm lg:text-base">
                    {convertToOneDecimal(details.vote_average)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Popcorn width={16} height={16} />{" "}
                  <span className="text-sm lg:text-base">
                    {convertToOneDecimal(details.popularity)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <p className="lg:text-base md:text-sm text-xs">Status</p>
                  <span className="lg:text-lg md:text-base text-sm font-medium">
                    {details.status}
                  </span>
                </div>
                <div>
                  <p className="lg:text-base md:text-sm text-xs">
                    Release date
                  </p>
                  <span className="lg:text-lg md:text-base text-sm font-medium">
                    {details.release_date}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <p className="lg:text-base md:text-sm text-xs">Run time</p>
                  <span className="lg:text-lg md:text-base text-sm font-medium">
                    {details.runtime} minutes
                  </span>
                </div>
                <div>
                  <p className="lg:text-base md:text-sm text-xs">Genres</p>
                  <span className="lg:text-lg md:text-base text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      {details.genres.map((genre) => (
                        <div key={genre.id}>
                          <p className="font-medium lg:text-lg md:text-base text-sm">
                            {genre.name}{" "}
                          </p>
                        </div>
                      ))}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
