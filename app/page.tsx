import Content from "@/components/ui/content";
import { Slider } from "@/components/ui/heroSlider";
import { trending, getAllTrending } from "@/lib/data";

export default async function Home() {
  const content = await getAllTrending();
  const tvcontent = content[2];
  return (
    <main className="min-h-screen">
      <Slider content={content[0]} />

      <div className="lg:px-20 mt-20">
        <Content
          content={content[0]}
          movieContent={content[1]}
          tvContent={tvcontent}
        />
      </div>
    </main>
  );
}
