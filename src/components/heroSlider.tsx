"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import "swiper/css";
import { Trending } from "@/schema";
import { useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Button } from "./ui/button";
import { icons } from "lucide-react";
import Link from "next/link";
const path = "https://image.tmdb.org/t/p/original";
function convertToOneDecimal(trendingVoteAverage: number): number {
  const decimalPart = trendingVoteAverage.toString().split(".")[1];
  if (decimalPart && decimalPart.length > 1) {
    return Math.round(trendingVoteAverage * 10) / 10;
  } else {
    return trendingVoteAverage;
  }
}
export default function Slider({ content }: { content: Trending[] }) {
  const filtered = useMemo(
    () =>
      content
        .filter(
          (trending) =>
            trending.media_type == "movie" || trending.media_type == "tv"
        )
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

  return (
    <Swiper
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      loop={true}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay, Pagination]}
    >
      {filtered.map((trending) => (
        <SwiperSlide key={trending.id}>
          <div className="w-full h-[700px] mx-auto flex items-center relative">
            <Image
              src={`${path}${trending.backdrop_path}`}
              width={4000}
              height={300}
              alt={trending.name || trending.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-zinc-950 opacity-50"></div>
            <div className="w-full px-[25px] md:px-[50px] lg:px-[100px] flex flex-col space-y-8 absolute text-white">
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-semibold">
                  {trending.name || trending.title}
                </h1>
                <div className="flex items-center space-x-2">
                  {" "}
                  <div className="flex items-center space-x-1">
                    <icons.Star width={16} height={16} />{" "}
                    <span>{convertToOneDecimal(trending.vote_average)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <icons.Popcorn width={16} height={16} />{" "}
                    <span>{convertToOneDecimal(trending.popularity)}</span>
                  </div>
                </div>
                <p className="md:max-w-xl line-clamp-2 text-sm lg:text-base ">
                  {trending.overview}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  className="rounded-none bg-transparent border-2 "
                  asChild
                >
                  <Link href={`/${trending.media_type}/${trending.id}`}>
                    View more
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
