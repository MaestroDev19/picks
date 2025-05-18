export interface Trailer {
    id: string;
    name: string;
    key: string;
    type: string;
    site: string;
    official: string;
}

/**
 * Represents the watch status of a media item
 */
export type WatchStatus = 'watched' | 'plan_to_watch';

/**
 * Represents a single item in a user's watchlist
 */
export interface WatchlistItem {
    id: string;
    displayTitle: string;
    posterPath: string | null;
    average: number;
    mediaType: 'movie' | 'tv';
    watchStatus: WatchStatus;
    dateAdded: string;
    dateWatched?: string;
}

/**
 * Represents a user's complete watchlist organized by media type
 */
export interface Watchlist {
    movies: WatchlistItem[];
    tvShows: WatchlistItem[];
    totalItems: number;
    watchedCount: number;
    planToWatchCount: number;
}

export interface Movies {
    id: string;
    title: string;
    poster_path?: string | null;
    backdrop_path?: string;
    vote_average: number;
    overview: string;
    popularity: number;
    adult: 'true' | 'false';
    runtime: number;
    homepage?: string;
    status: string;
    release_date: string;
    genres: {id: string; name: string}[];
}


export interface TvShows {
    id: string;
    name: string;
    type: string;
    vote_average: number;
    overview: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    popularity: number;
    first_air_date: string;
    last_air_date: string;
    number_of_episodes: number;
    number_of_seasons: number;
    status: string;
    homepage?: string;
    networks: {id: number; name: string; logo_path: string | null}[];
    genres: {id: string; name: string}[];
}

export interface TvDetails extends TvShows {
    
}
export interface Trending {
    id: string;
    title?: string;
    name?: string; // For TV shows
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average: number;
    overview: string;
    media_type: 'movie' | 'tv'; // To distinguish between movies and TV shows
    release_date?: string; // For movies
    first_air_date?: string; // For TV shows
    popularity: number;
    genres: {id: string; name: string}[];
}

export interface TrendingDetails extends Trending {
  
}
/**
 * Interface defining all API endpoints used in the application
 */
export interface Endpoints {
    // Movie endpoints
    discoverMovie: string;
    now: string; // now_playing movies
    ratedMovie: string; // top rated movies
    
    // TV show endpoints
    discoverTv: string;
    ratedTv: string; // top rated TV shows
    today: string; // TV shows airing today

    // Trending
    trending: string;
    trendingTv: string;
    trendingMovie: string;
}

/**
 * Interface for data fetching results
 * Used to type the response from API calls
 */
export interface DataEndpoint {
    today: TvShows[];
    now: Movies[];
    ratedMovie: Movies[];
    ratedTv: TvShows[];
    discoverMovie: Movies[];
    discoverTv: TvShows[];
}