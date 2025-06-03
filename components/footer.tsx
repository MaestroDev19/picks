import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand and Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Picks</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Your go-to platform for discovering, tracking, and sharing your
              favorite movies and TV shows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="flex flex-row gap-2 text-sm">
              <li>
                <Link
                  href="/movies"
                  className="text-muted-foreground hover:text-primary"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/tv-shows"
                  className="text-muted-foreground hover:text-primary"
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/watchlist"
                  className="text-muted-foreground hover:text-primary"
                >
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}

          {/* Social Links */}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Picks. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
