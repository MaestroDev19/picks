import Slider from "@/components/heroSlider";
import { discoverMovie, trending } from "@/lib/data";
import Image from "next/image";

export default async function Home() {
  const trendingMedia = await trending();
  console.log(trendingMedia);
  const filteredMedia = trendingMedia.filter((trending) => {
    trending.media_type === "movie" || trending.media_type === "tv";
  });
  return (
    <main className="min-h-screen">
      <Slider content={trendingMedia} />
      <p>p</p>
    </main>
  );
}
