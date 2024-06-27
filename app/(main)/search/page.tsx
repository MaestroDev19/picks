import { SearchBox } from "@/components/searchbox";
import { Result } from "@/components/searchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { Trending } from "@/lib/data";
import { Link, Star, Popcorn } from "lucide-react";
import Image from "next/image";
import { Suspense, useMemo } from "react";

export default async function Search({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search || "";
  const key = process.env.API_KEY;
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${search}`;

  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();

  return (
    <main className="min-h-screen px-5 md:px-10 lg:px-20 my-20 grid gap-y-20">
      <div className="space-y-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-semibold">
          Search
        </h2>
        <SearchBox />

        <Result result={result.results} />
      </div>
    </main>
  );
}
