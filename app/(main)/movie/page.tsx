import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Page() {
  const key = process.env.API_KEY;
  const path = "https://image.tmdb.org/t/p/original";
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${key}`
  );
  const apiGenres = await response.json();
  const predefinedGenres = [
    { title: "action", description: "Fast-paced, thrilling." },
    { title: "adventure", description: "Exciting, exploratory." },
    { title: "animation", description: "Animated, varied." },
    { title: "comedy", description: "Humorous, entertaining." },
    { title: "crime", description: "Criminal, law." },
    { title: "documentary", description: "Non-fiction, informative." },
    { title: "drama", description: "Emotional, character-driven." },
    { title: "family", description: "All-ages, wholesome." },
    { title: "fantasy", description: "Magical, imaginary." },
    { title: "fiction", description: "Imaginative, unreal." },
    { title: "history", description: "Historical, authentic." },
    { title: "horror", description: "Scary, supernatural." },
    { title: "music", description: "Musical, performative." },
    { title: "mystery", description: "Puzzling, investigative." },
    { title: "romance", description: "Love, relationships." },
    { title: "science fiction", description: "Futuristic, speculative." },
    { title: "thriller", description: "Suspenseful, tense." },
    { title: "war", description: "Military, battles." },
    { title: "western", description: "Old West." },
  ];
  const mergedGenres = apiGenres.genres.map((apiGenre: any) => {
    const predefinedGenre = predefinedGenres.find(
      (genre) => genre.title.toLowerCase() === apiGenre.name.toLowerCase()
    );
    return {
      id: apiGenre.id,
      title: apiGenre.name,
      description: predefinedGenre
        ? predefinedGenre.description
        : "No description available.",
    };
  });

  return (
    <main className="min-h-dvh">
      <div className="px-5 md:px-10 lg:px-20 my-20 grid gap-y-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-semibold">
          Movies
        </h2>
        <div className="  grid gap-[20px] lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  w-full">
          {mergedGenres.map((genre: any) => {
            return (
              <Link
                href={`/movie/genre/${genre.id}-${genre.title}`}
                key={genre.id}
              >
                <Card className="hover:bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="capitalize">{genre.title}</CardTitle>
                    <CardDescription>{genre.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
