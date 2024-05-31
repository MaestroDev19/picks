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
          hi
        </div>
      </section>
    </>
  );
}
