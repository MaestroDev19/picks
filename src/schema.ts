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
}

export interface Video {
  type: string;
  site: string;
  offical: string;
  key: string;
  id: string;
  name: string;
}
