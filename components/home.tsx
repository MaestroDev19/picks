
import Slider from "./slider";
import { trending, getTrending, getTopRated } from "@/data/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { TrendingMoviesSkeleton } from "./movie-skeleton";
import { getMovieDetails, getTvDetails } from "@/data/data"
import { MovieCard } from "./movie-card";


// Create a component that fetches and displays trending movies
async function TrendingMovies() {
  // This will be suspended by React Suspense while loading
  const [all, tv, movies] = await getTrending();
   
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold py-5">Trending Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 18).map(async (movie) => {
          const details = await getMovieDetails(movie.id);
          return <MovieCard key={movie.id} item={details} />;
        }
      
        )}
      </div>
    </div>
  );
}

// Similar component for TV shows
async function TrendingTVShows() {
  const [all, tv, movies] = await getTrending();
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold py-5">Trending Tv Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tv.slice(0, 18).map(async(show) => {
          const showDetails = await getTvDetails(show.id)
          return <MovieCard key={show.id} item={showDetails} />

})}
      </div>
    </div>
  );
}

async function EditorsPicksTv() {
  const [_,tv] = await getTopRated()
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold py-5">Editors Picks Tv Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tv.slice(0, 18).map(async(show) => {
          const showDetails = await getTvDetails(show.id)
          return <MovieCard key={show.id} item={showDetails} />
})}
      </div>
    </div>
  )
}
async function EditorsPicksMovies() {
  const [movies,_] = await getTopRated()
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold py-5">Editors Picks Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 18).map(async (movie) => {
          const details = await getMovieDetails(movie.id);
          return <MovieCard key={movie.id} item={details} />;
        })}
      </div>
    </div>
  ) 
}

export default async function HomeLayout() {
  // This data is needed for the slider and won't be suspended
  const popular = await trending();
  
  return <main className="min-h-dvh bg-black text-white">
      <Slider contents={popular} />
      
      <section className="px-8 md:px-10 lg:px-12 py-10">
        <Tabs defaultValue="movie">
          <TabsList className="max-w-xl">
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="tv">Tv Shows</TabsTrigger>
          </TabsList>
          <TabsContent value="movie">
            <div className="space-y-12">
              {/* Wrap the component that fetches data in Suspense */}
              <Suspense fallback={<TrendingMoviesSkeleton />}>
                <TrendingMovies />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="tv">
            <div className="space-y-12">
              {/* Suspense for TV shows */}
              <Suspense fallback={<TrendingMoviesSkeleton />}>
                <TrendingTVShows />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </section>  
    
      <section className="px-8 md:px-10 lg:px-12 py-10">
        <Tabs defaultValue="movie">
          <TabsList className="max-w-xl">
            
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="tv">Tv Shows</TabsTrigger>
          </TabsList>
          <TabsContent value="tv">
            <div className="space-y-12">
              {/* Suspense for TV shows */}
              <Suspense fallback={<TrendingMoviesSkeleton />}>
                <EditorsPicksTv />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="movie">
            <div className="space-y-12">
              {/* Suspense for TV shows */}
              <Suspense fallback={<TrendingMoviesSkeleton />}>
                <EditorsPicksMovies />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
   </main>
}