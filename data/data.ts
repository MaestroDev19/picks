import type {
  Endpoints,
  Movies,
  Trailer,
  Trending,
  TvShows,
  Genre,
} from "./types";
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

  // Genre endpoints
  movieGenres: "/genre/movie/list",
  tvGenres: "/genre/tv/list",

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

// Static genre mappings for better performance
const MOVIE_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

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

export const discoverMovie = async (page = 1) => {
  return await fetchData<Movies[]>({
    endpoint: picksEndpoints.discoverMovie,
    page,
  });
};

export const now = async (page = 1) => {
  return await fetchData<Movies[]>({ endpoint: picksEndpoints.now, page });
};

export const ratedMovie = async (page = 1) => {
  return await fetchData<Movies[]>({
    endpoint: picksEndpoints.ratedMovie,
    page,
  });
};

export const discoverTv = async (page = 1) => {
  return await fetchData<TvShows[]>({
    endpoint: picksEndpoints.discoverTv,
    page,
  });
};

export const ratedTv = async (page = 1) => {
  return await fetchData<TvShows[]>({ endpoint: picksEndpoints.ratedTv, page });
};

export const today = async (page = 1) => {
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
      params: {
        include_adult: false,
        append_to_response: "credits,recommendations,similar,keywords",
        language: "en-US",
      },
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
      params: {
        include_adult: false,
        append_to_response:
          "credits,recommendations,similar,keywords,content_ratings",
        language: "en-US",
      },
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

// Cache for genres to avoid repeated API calls
let movieGenresCache: Genre[] | null = null;
let tvGenresCache: Genre[] | null = null;

export async function getMovieGenres(forceRefresh = false): Promise<Genre[]> {
  try {
    // Return cached genres if available and refresh not forced
    if (movieGenresCache && !forceRefresh) {
      return movieGenresCache;
    }

    const res = await tmdbApi.get(picksEndpoints.movieGenres, {
      params: {
        language: "en-US",
      },
    });

    // Update cache
    movieGenresCache = res.data.genres as Genre[];
    return movieGenresCache;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API error fetching movie genres:", {
        status: error.response?.status,
        message: error.response?.data?.status_message,
      });
      throw new Error(
        `Failed to fetch movie genres: ${
          error.response?.data?.status_message || error.message
        }`
      );
    }
    console.error("Error fetching movie genres:", error);
    throw new Error("Failed to fetch movie genres");
  }
}

export async function getTvGenres(forceRefresh = false): Promise<Genre[]> {
  try {
    // Return cached genres if available and refresh not forced
    if (tvGenresCache && !forceRefresh) {
      return tvGenresCache;
    }

    const res = await tmdbApi.get(picksEndpoints.tvGenres, {
      params: {
        language: "en-US",
      },
    });

    // Update cache
    tvGenresCache = res.data.genres as Genre[];
    return tvGenresCache;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API error fetching TV genres:", {
        status: error.response?.status,
        message: error.response?.data?.status_message,
      });
      throw new Error(
        `Failed to fetch TV genres: ${
          error.response?.data?.status_message || error.message
        }`
      );
    }
    console.error("Error fetching TV genres:", error);
    throw new Error("Failed to fetch TV genres");
  }
}

interface DiscoverOptions {
  page?: number;
  sortBy?:
    | "popularity.desc"
    | "vote_average.desc"
    | "primary_release_date.desc";
  minVoteCount?: number;
  minVoteAverage?: number;
  releaseDateGte?: string; // YYYY-MM-DD format
  releaseDateLte?: string; // YYYY-MM-DD format
  withOriginalLanguage?: string;
}

export async function discoverMoviesByGenre(
  genreId: string,
  options: DiscoverOptions = {}
): Promise<Movies[]> {
  try {
    const {
      page = 1,
      sortBy = "popularity.desc",
      minVoteCount = 100,
      minVoteAverage,
      releaseDateGte,
      releaseDateLte,
      withOriginalLanguage,
    } = options;

    const res = await tmdbApi.get(picksEndpoints.discoverMovie, {
      params: {
        with_genres: genreId,
        page,
        language: "en-US",
        sort_by: sortBy,
        include_adult: false,
        "vote_count.gte": minVoteCount,
        ...(minVoteAverage && { "vote_average.gte": minVoteAverage }),
        ...(releaseDateGte && { "primary_release_date.gte": releaseDateGte }),
        ...(releaseDateLte && { "primary_release_date.lte": releaseDateLte }),
        ...(withOriginalLanguage && {
          with_original_language: withOriginalLanguage,
        }),
      },
    });

    if (!res.data.results) {
      throw new Error("Invalid response format from TMDB API");
    }

    return res.data.results as Movies[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API error discovering movies by genre:", {
        genreId,
        status: error.response?.status,
        message: error.response?.data?.status_message,
      });
      throw new Error(
        `Failed to discover movies: ${
          error.response?.data?.status_message || error.message
        }`
      );
    }
    console.error("Error discovering movies by genre:", error);
    throw new Error("Failed to discover movies by genre");
  }
}

export async function discoverTvByGenre(
  genreId: string,
  options: DiscoverOptions = {}
): Promise<TvShows[]> {
  try {
    const {
      page = 1,
      sortBy = "popularity.desc",
      minVoteCount = 100,
      minVoteAverage,
      releaseDateGte,
      releaseDateLte,
      withOriginalLanguage,
    } = options;

    const res = await tmdbApi.get(picksEndpoints.discoverTv, {
      params: {
        with_genres: genreId,
        page,
        language: "en-US",
        sort_by: sortBy,
        include_adult: false,
        "vote_count.gte": minVoteCount,
        ...(minVoteAverage && { "vote_average.gte": minVoteAverage }),
        ...(releaseDateGte && { "first_air_date.gte": releaseDateGte }),
        ...(releaseDateLte && { "first_air_date.lte": releaseDateLte }),
        ...(withOriginalLanguage && {
          with_original_language: withOriginalLanguage,
        }),
      },
    });

    if (!res.data.results) {
      throw new Error("Invalid response format from TMDB API");
    }

    return res.data.results as TvShows[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TMDB API error discovering TV shows by genre:", {
        genreId,
        status: error.response?.status,
        message: error.response?.data?.status_message,
      });
      throw new Error(
        `Failed to discover TV shows: ${
          error.response?.data?.status_message || error.message
        }`
      );
    }
    console.error("Error discovering TV shows by genre:", error);
    throw new Error("Failed to discover TV shows by genre");
  }
}

// Improved genre name functions using static mappings
export function getMovieGenreName(genreId: number | string): string {
  const genreIdNum =
    typeof genreId === "string" ? Number.parseInt(genreId, 10) : genreId;
  return MOVIE_GENRES[genreIdNum] || "Unknown Genre";
}

export function getTvGenreName(genreId: number | string): string {
  const genreIdNum =
    typeof genreId === "string" ? Number.parseInt(genreId, 10) : genreId;
  return TV_GENRES[genreIdNum] || "Unknown Genre";
}

// Generic function that works for both movies and TV shows
export function getGenreName(
  genreId: number | string,
  mediaType: "movie" | "tv" = "movie"
): string {
  if (mediaType === "tv") {
    return getTvGenreName(genreId);
  }
  return getMovieGenreName(genreId);
}

// Alternative function that tries to determine media type automatically
export function getGenreNameSmart(genreId: number | string): string {
  const genreIdNum =
    typeof genreId === "string" ? Number.parseInt(genreId, 10) : genreId;

  // Check if it exists in movie genres first
  if (MOVIE_GENRES[genreIdNum]) {
    return MOVIE_GENRES[genreIdNum];
  }

  // Then check TV genres
  if (TV_GENRES[genreIdNum]) {
    return TV_GENRES[genreIdNum];
  }

  return "Unknown Genre";
}

// Function to get all available movie genres
export function getAllMovieGenres(): Array<{ id: number; name: string }> {
  return Object.entries(MOVIE_GENRES).map(([id, name]) => ({
    id: Number.parseInt(id, 10),
    name,
  }));
}

// Function to get all available TV genres
export function getAllTvGenres(): Array<{ id: number; name: string }> {
  return Object.entries(TV_GENRES).map(([id, name]) => ({
    id: Number.parseInt(id, 10),
    name,
  }));
}
