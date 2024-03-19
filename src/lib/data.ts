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

type PickType = keyof Endpoints; // Define type for pick endpoints

async function getData<T extends Movies | Tv>(
  pick: PickType,
  page: number = 1
): Promise<(Movies | Tv)[]> {
  const endpoint = picksEndpoints[pick]; // Access endpoint URL dynamically
  const response = await fetch(`${url}${endpoint}?api_key=${key}&page=${page}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  console.log(response);
  const data = await response.json();
  return data.results as (Movies | Tv)[]; // Assuming results property holds the data array
}

export async function discoverMovie(page: number = 1) {
  const discoverMovie = await getData<Movies>("discoverMovie", page);
  console.log(discoverMovie);
  return discoverMovie;
}
discoverMovie();
export async function now(page: number = 1) {
  const nowMovie = await getData<Movies>("now", page);
  return nowMovie;
}

export async function ratedMovie(page: number = 1) {
  const ratedMovie = await getData<Movies>("ratedMovie", page);
  return ratedMovie;
}

export async function ratedtv(page: number = 1) {
  const ratedTv = await getData<Tv>("ratedTv", page);
  return ratedTv;
}

export async function discoverTV(page: number = 1) {
  const discoverTv = await getData<Tv>("discoverTv", page);
  return discoverTv;
}

export async function air(page: number = 1) {
  const today = await getData<Tv>("today", page);
  return today;
}

export async function trending(page: number = 1): Promise<Trending[]> {
  const response = await fetch(
    `${url}/trending/all/week?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  return data.results as Trending[];
}
