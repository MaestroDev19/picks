import { atomWithStorage } from "jotai/utils";
import { Movies, Tv } from "./data";
export interface WatchlistItem {
  vote_average: number;
  popularity: number;
  id: string;
  name?: string;
  title?: string;
  poster_path?: string | null;
  media_type: string; // Include media_type to distinguish between movies and TV shows
}

interface List {
  movies: WatchlistItem[];
  tvShows: WatchlistItem[];
}
export const myListFlow = atomWithStorage<List>("myListFlow", {
  movies: [],
  tvShows: [],
});
