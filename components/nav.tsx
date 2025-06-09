"use client";

import { useState } from "react";
import { Menu, Search, User, X, Film, Tv, Bookmark, Home } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { searchApi } from "@/data/data";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movie", icon: Film },
  { name: "TV Shows", href: "/tv", icon: Tv },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
];

export default function MovieNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await searchApi(searchQuery);
      setResults(res.results.slice(0, 5)); // Limit to 5 results for better UX
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: any) => {
    const mediaType =
      result.media_type || (result.first_air_date ? "tv" : "movie");
    router.push(`/${mediaType}/${result.id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  const SearchResults = () => (
    <Card className="absolute left-0 right-0 w-full max-w-[400px] top-full mt-2 z-50">
      <ScrollArea className="h-[300px] p-2">
        {results.length > 0 ? (
          results.map((result: any) => (
            <button
              key={result.id}
              className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-sm text-left"
              onClick={() => handleResultClick(result)}
            >
              {result.poster_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE}${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-12 h-16 object-cover rounded-sm"
                />
              ) : (
                <div className="w-12 h-16 bg-muted flex items-center justify-center rounded-sm">
                  <Film className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {result.title || result.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.media_type === "tv" || result.first_air_date
                    ? "TV Show"
                    : "Movie"}
                </p>
              </div>
            </button>
          ))
        ) : isLoading ? (
          <p className="p-2 text-sm text-muted-foreground">Searching...</p>
        ) : searchQuery ? (
          <p className="p-2 text-sm text-muted-foreground">No results found</p>
        ) : null}
      </ScrollArea>
    </Card>
  );

  return (
    <nav className="sticky top-0 z-50 w-full max-w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground/80">Picks</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Search & Auth */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    onClick={handleSearch}
                  />
                  <Input
                    type="search"
                    placeholder="Search movies, TV shows..."
                    className="w-64 pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch();
                    }}
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                {(results.length > 0 || isLoading) && <SearchResults />}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Link href="/login" className="w-full">
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/signup" className="w-full">
                  Sign Up
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Mobile Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              <div className="flex flex-col space-y-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 text-lg font-medium text-foreground p-2"
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="space-y-3 pt-6 border-t">
                  <Button asChild className="w-full">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>

                {/* Mobile User Links */}
                <div className="space-y-3 pt-6 border-t">
                  <Link
                    href="/profile"
                    className="block text-sm text-muted-foreground hover:text-foreground p-2"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block text-sm text-muted-foreground hover:text-foreground p-2"
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="relative border-t bg-background px-4 py-3 md:hidden">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              onClick={handleSearch}
            />
            <Input
              type="search"
              placeholder="Search movies, TV shows..."
              className="w-full pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
              autoFocus
            />
          </div>
          {(results.length > 0 || isLoading) && <SearchResults />}
        </div>
      )}
    </nav>
  );
}
