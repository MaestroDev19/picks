export interface Movies {
  id: string;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_count: number;
  vote_average: number;
  overview: string;
  tagline: string;
  status: string;
  popularity: number;
  runtime: number;
  release_date: string;
  homepage: string;
  first_air_date_year: number;
  genres: { id: number; name: string }[];
}
export interface Tv {
  id: string;
  type: string;
  status: string;
  networks: { id: number; logo_path: string; name: string }[];
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_count: number;
  vote_average: number;
  overview: string;
  tagline: string;
  popularity: number;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  first_air_date: string;
  first_air_date_year: number;
  last_air_date: string;

  homepage: string;
}

export interface Endpoints {
  now: string;
  ratedTv: string;
  discoverMovie: string;
  discoverTv: string;
  ratedMovie: string;
  today: string;
}

export interface Trending {
  vote_count: number;
  vote_average: number;
  overview: string;
  tagline: string;
  popularity: number;
  id: string;
  name: string;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  media_type: string;
  genres: { id: number; name: string }[];
}

export interface Video {
  type: string;
  site: string;
  offical: string;
  key: string;
  id: string;
  name: string;
}
export interface Video {
  type: string;
  site: string;
  offical: string;
  key: string;
  id: string;
  name: string;
}
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

async function fetchData<T>(endpoint: string, page: number = 1): Promise<T> {
  const response = await fetch(
    `${url}${endpoint}?api_key=${key}&page=${page}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching data from ${endpoint}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.results as T;
}

export const discoverMovie = (page: number = 1) =>
  fetchData<Movies[]>("/discover/movie", page);
export const discoverTV = (page: number = 1) =>
  fetchData<Tv[]>("/discover/tv", page);
export const trending = (page: number = 1) =>
  fetchData<Trending[]>("/trending/all/day", page);
export const trendingMovie = (page: number = 1) =>
  fetchData<Trending[]>("/trending/movie/day", page);
export const trendingTv = (page: number = 1) =>
  fetchData<Trending[]>("/trending/tv/day", page);
export const topRatedMovies = (page: number = 1) =>
  fetchData<Movies[]>("/movie/top_rated", page);
export const topRatedTvshows = (page: number = 1) =>
  fetchData<Tv[]>("/tv/top_rated", page);

export async function getAllTrending(
  page: number = 1
): Promise<[Trending[], Trending[], Trending[]]> {
  const [allTrending, movieTrending, tvTrending] = await Promise.all([
    trending(page),
    trendingMovie(page),
    trendingTv(page),
  ]);
  return [allTrending, movieTrending, tvTrending];
}

export async function topRated(page: number = 1): Promise<[Movies[], Tv[]]> {
  const [topMovies, topTvShows] = await Promise.all([
    topRatedMovies(page),
    topRatedTvshows(page),
  ]);
  return [topMovies, topTvShows];
}
