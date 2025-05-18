import { atomWithStorage } from "jotai/utils";
import { Watchlist} from "./types";
export const watchlistAtom = atomWithStorage<Watchlist>("watchlist", {
    movies: [],
    tvShows: [],
    totalItems: 0,
    watchedCount: 0,
    planToWatchCount: 0,
})

