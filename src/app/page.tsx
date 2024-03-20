import Content from "@/components/content";
import Slider from "@/components/heroSlider";
import { discoverMovie, trending } from "@/lib/data";
import Image from "next/image";

export default async function Home() {
  const trendingMedia = await trending();
  console.log(trendingMedia);

  return (
    <main className="min-h-screen">
      <Slider content={trendingMedia} />
      <section className="mt-[80px] px-[25px]  md:px-[50px] lg:px-[100px] space-y-10 pb-[100px]">
        <div className="space-y-5">
          <h2 className="font-medium text-2xl md:text-3xl lg:text-4xl">
            Trending
          </h2>
          <Content content={trendingMedia} />
        </div>
      </section>
    </main>
  );
}
