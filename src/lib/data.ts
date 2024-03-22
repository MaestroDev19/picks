import { Movies, Tv, Endpoints, Trending } from "@/schema"; // Assuming schema imports

const key = process.env.API_KEY;
const url = "https://api.themoviedb.org/3";

const picksEndpoints: Endpoints = {
  discoverMovie: "/discover/movie",
  discoverTv: "/discover/tv",
  now: "/movie/now_playing",
  ratedTv: "/tv/top_rated",
  ratedMovie: "/movie/top_rated",
  today: "/tv/airing_today",
};

export async function discoverMovie(page: number = 1) {
  const response = await fetch(
    `${url}/discover/movie?api_key=${key}&page=${page}`
  );
  const discoverMovie = await response.json();

  return discoverMovie.results as Movies[];
}
discoverMovie();

export async function discoverTV(page: number = 1) {
  const response = await fetch(
    `${url}/discover/tv?api_key=${key}&page=${page}`
  );

  const discoverTv = await response.json();
  return discoverTv.results as Tv[];
}

export async function trending(page: number = 1): Promise<Trending[]> {
  const response = await fetch(
    `${url}/trending/all/day?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  return data.results as Trending[];
}

export async function trendingMovie(page: number = 1): Promise<Trending[]> {
  const response = await fetch(
    `${url}/trending/movie/day?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  return data.results as Trending[];
}

export async function trendingTv(page: number = 1): Promise<Trending[]> {
  const response = await fetch(
    `${url}/trending/tv/day?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  return data.results as Trending[];
}

export async function getAllTrending(page: number = 1): Promise<Trending[][]> {
  const allTrending = await trending(page);
  const movieTrending = await trendingMovie(page);
  const tvTrending = await trendingTv(page);

  return [allTrending, movieTrending, tvTrending];
}

export async function topRatedMovies(page: number = 1): Promise<Movies[]> {
  const response = await fetch(
    `${url}/movie/top_rated?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error fetching trending TV shows: ${response.statusText}`);
  }
  return data.results as Movies[];
}

export async function topRatedTvshows(page: number = 1): Promise<Tv[]> {
  const response = await fetch(
    `${url}/tv/top_rated?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error fetching trending TV shows: ${response.statusText}`);
  }
  return data.results as Tv[];
}

export async function topRated(page: number = 1): Promise<[Movies[], Tv[]]> {
  const topMovies = await topRatedMovies(page);
  const topTvShows = await topRatedTvshows(page);
  return [topMovies, topTvShows];
}
