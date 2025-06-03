import { Endpoints, Movies, Trailer, Trending, TvShows } from "./types";
import axios from "axios";

export const picksEndpoints: Endpoints = {
  // Movie endpoints
  discoverMovie: "/discover/movie",
  now: "/movie/now_playing",
  ratedMovie: "/movie/top_rated",

  // TV show endpoints
  discoverTv: "/discover/tv",
  ratedTv: "/tv/top_rated",
  today: "/tv/airing_today",
  // Trending
  trendingTv: "/trending/tv/day",
  trendingMovie: "/trending/movie/day",
  trending: "/trending/all/day",
} as const;

interface FetchOptions {
  endpoint: string;
  page?: number;
  cache?: RequestCache;
}

// Create axios instance with base configuration
const tmdbApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    accept: "application/json",
  },
});

async function fetchData<T>({
  endpoint,
  page = 1,
  cache = "no-store",
}: FetchOptions): Promise<T> {
  if (!process.env.NEXT_PUBLIC_TMDB_URL) {
    throw new Error("Missing required environment variables");
  }

  try {
    const response = await tmdbApi.get(endpoint, {
      params: {
        page,
        include_adult: false,
      },
      headers: cache === "no-store" ? { "Cache-Control": "no-store" } : {},
    });

    const data = response.data;

    if (!data.results) {
      throw new Error("Invalid response format");
    }

    return data.results as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `HTTP error! status: ${error.response?.status || "unknown"}`
      );
    } else {
      console.error("Error fetching data:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    }
  }
}

export const discoverMovie = async (page: number = 1) => {
  return await fetchData<Movies[]>({
    endpoint: picksEndpoints.discoverMovie,
    page,
  });
};

export const now = async (page: number = 1) => {
  return await fetchData<Movies[]>({ endpoint: picksEndpoints.now, page });
};

export const ratedMovie = async (page: number = 1) => {
  return await fetchData<Movies[]>({
    endpoint: picksEndpoints.ratedMovie,
    page,
  });
};

export const discoverTv = async (page: number = 1) => {
  return await fetchData<TvShows[]>({
    endpoint: picksEndpoints.discoverTv,
    page,
  });
};

export const ratedTv = async (page: number = 1) => {
  return await fetchData<TvShows[]>({ endpoint: picksEndpoints.ratedTv, page });
};

export const today = async (page: number = 1) => {
  return await fetchData<TvShows[]>({ endpoint: picksEndpoints.today, page });
};

export const trending = async () => {
  return await fetchData<Trending[]>({ endpoint: picksEndpoints.trending });
};

export const trendingTv = async () => {
  return await fetchData<Trending[]>({ endpoint: picksEndpoints.trendingTv });
};

export const trendingMovie = async () => {
  return await fetchData<Trending[]>({
    endpoint: picksEndpoints.trendingMovie,
  });
};

export async function getTrending(): Promise<Trending[][]> {
  try {
    const [allTrending, tvTrending, movieTrending] = await Promise.all([
      trending(),
      trendingTv(),
      trendingMovie(),
    ]);

    return [allTrending, tvTrending, movieTrending];
  } catch (error) {
    console.error("Error fetching trending data:", error);
    throw new Error("Failed to fetch trending data");
  }
}

export async function getTopRated(): Promise<[Movies[], TvShows[]]> {
  try {
    const [topRatedMovies, topRatedTv] = await Promise.all([
      ratedMovie(),
      ratedTv(),
    ]);
    return [topRatedMovies, topRatedTv];
  } catch (error) {
    console.error("Error fetching top rated data:", error);
    throw new Error("Failed to fetch top rated data");
  }
}

export async function getTrailers(
  id: number,
  mediaType: "tv" | "movie"
): Promise<Trailer[]> {
  try {
    // Use the tmdbApi instance that already has the proper authentication headers
    const res = await tmdbApi.get(`/${mediaType}/${id}/videos`, {
      params: { include_adult: false },
    });
    return res.data.results as Trailer[];
  } catch (error) {
    console.error("Error fetching trailers:", error);
    throw new Error("Failed to fetch trailers");
  }
}

export async function getMovieDetails(id: string): Promise<Movies> {
  try {
    const res = await tmdbApi.get(`/movie/${id}`, {
      params: { include_adult: false },
    });
    return res.data as Movies;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw new Error("Failed to fetch movie details");
  }
}

export async function getTvDetails(id: string): Promise<TvShows> {
  try {
    const res = await tmdbApi.get(`/tv/${id}`, {
      params: { include_adult: false },
    });
    return res.data as TvShows;
  } catch (error) {
    console.error("Error fetching tv details:", error);
    throw new Error("Failed to fetch tv details");
  }
}

export async function searchApi(query: string) {
  try {
    const res = await tmdbApi.get("/search/multi", {
      params: { query, include_adult: false },
    });
    // Filter results to only include movies and TV shows
    const filteredResults = res.data.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv"
    );
    return { ...res.data, results: filteredResults };
  } catch (error) {
    console.error("Error fetching search data:", error);
    throw new Error("Failed to fetch search data");
  }
}
