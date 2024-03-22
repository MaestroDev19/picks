/* eslint-disable react/no-unescaped-entities */
import Content from "@/components/content";
import Slider from "@/components/heroSlider";
import Top from "@/components/rated";
import { Skeleton } from "@/components/ui/skeleton";

import { discoverMovie, getAllTrending, topRated } from "@/lib/data";
import Image from "next/image";
import { Suspense } from "react";

export default async function Home() {
  const [trendingMedia, movieTrending, tvTrending] = await getAllTrending();
  const [topMovies, topTv] = await topRated();

  return (
    <main className="min-h-screen">
      <Slider content={trendingMedia} />
      <section className="mt-[80px] px-[25px]  md:px-[50px] lg:px-[100px] space-y-10 pb-[100px]">
        <div className="space-y-5">
          <h2 className="font-medium text-2xl md:text-3xl lg:text-4xl">
            Trending
          </h2>

          <Content
            content={trendingMedia}
            movieContent={movieTrending}
            tvContent={tvTrending}
          />
        </div>
        <div className="space-y-5">
          <h2 className="font-medium text-2xl md:text-3xl lg:text-4xl">
            Admin's Picks
          </h2>
          <Top movies={topMovies} tvs={topTv} />
        </div>
      </section>
    </main>
  );
}
