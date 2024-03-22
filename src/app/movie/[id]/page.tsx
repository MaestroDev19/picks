import { Movies, Video } from "@/schema";
import Link from "next/link";
import Image from "next/image";
import { icons } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function MovieInfo({
  params,
}: {
  params: { id: string };
}) {
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
      <section className="pb-[100px]">
        <div className="w-full h-[600px] mx-auto flex items-center aspect-auto relative">
          <iframe
            width="560"
            height="315"
            title="YouTube video player"
            src={`https://www.youtube.com/embed/${
              trailer.key || trailer
            }?si=FGXLUKs0JdCHVD7l&autoplay=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-[80px] px-[25px] md:px-[50px] lg:px-[100px] space-y-10">
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

          <div className="grid md:grid-cols-2 md:gap-x-[40px] gap-y-[40px]">
            <div className="lg:w-2/3 h-fit relative">
              <Image
                src={`${path}${details.poster_path}`}
                width={4000}
                height={300}
                alt={details.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="lg:text-3xl md:text-2xl text-xl font-medium ">
                {details.tagline}
              </h2>
              <p className="text-sm lg:text-base">{details.overview}</p>
              <div className="flex items-center space-x-2">
                {" "}
                <div className="flex items-center space-x-1">
                  <icons.Star width={16} height={16} />{" "}
                  <span className="text-sm lg:text-base">
                    {convertToOneDecimal(details.vote_average)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <icons.Popcorn width={16} height={16} />{" "}
                  <span className="text-sm lg:text-base">
                    {convertToOneDecimal(details.popularity)}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-x-[40px] gap-y-[40px] md:gap-y-[40px]">
                <div className="space-y-2">
                  <h3 className="lg:text-base md:text-sm text-xs">Status</h3>
                  <p className="lg:text-lg md:text-base text-sm font-medium">
                    {details.status}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="lg:text-base md:text-sm text-xs">
                    Release date
                  </h3>
                  <p className="lg:text-lg md:text-base text-sm font-medium">
                    {details.release_date}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-x-[40px] gap-y-[40px] md:gap-y-[40px]">
                {" "}
                <div className="space-y-2">
                  <h3 className="lg:text-base md:text-sm text-xs">Genres</h3>
                  <div className="flex flex-col space-y-1">
                    {details.genres.map((genre) => (
                      <div key={genre.id}>
                        <p className="font-medium lg:text-lg md:text-base text-sm">
                          {genre.name}{" "}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="lg:text-base md:text-sm text-xs">Run time</h3>
                  <p className="lg:text-lg md:text-base text-sm font-medium">
                    {details.runtime} min
                  </p>
                </div>
                <div className=" space-y-2">
                  <h3 className="lg:text-base md:text-sm text-xs">Website</h3>
                  <Link
                    href={`${details.homepage}`}
                    target="_blank"
                    className="lg:text-lg md:text-base text-sm font-medium"
                  >
                    More info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
