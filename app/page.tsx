/* eslint-disable react/no-unescaped-entities */
import Rated from "@/components/rated";
import Content from "@/components/ui/content";
import { Slider } from "@/components/ui/heroSlider";
import { getAllTrending, topRatedTvshows, topRatedMovies } from "@/lib/data";

export default async function Home() {
  const content = await getAllTrending();
  const topRatedContentTV = await topRatedTvshows();
  const topRatedContentMovie = await topRatedMovies();
  const tvcontent = content[2];
  return (
    <main className="min-h-screen">
      <Slider content={content[0]} />
      <div className="px-5 md:px-10 lg:px-20 my-20 grid gap-y-20">
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-semibold">
            Trending
          </h2>
          <Content
            content={content[0]}
            movieContent={content[1]}
            tvContent={tvcontent}
          />
        </div>
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-semibold">
            Editor's Picks
          </h2>
          <Rated
            movieContent={topRatedContentMovie}
            tvContent={topRatedContentTV}
          />
        </div>
      </div>
    </main>
  );
}
