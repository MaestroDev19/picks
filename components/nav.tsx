"use client";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import NavLink from "./link";
import { Fragment, useState } from "react";
import { fetchProfileData, loginWithGoogle } from "@/lib/actions";
export function Nav() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movie" },
    { name: "Tv", href: "/tv" },
    { name: "Picks", href: "/picks" },
    { name: "Search", href: "/search" },
  ];
  const { theme, setTheme } = useTheme();

  const googleSignIn = async () => {
    const url = await loginWithGoogle();
    if (url) {
      window.location.href = url;
    }
  };
  return (
    <>
      <header className="sticky z-10 w-full  top-0 flex justify-end py-4 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="sr-only">Auditro</span>
          </Link>
          {links.map((link) => (
            <Fragment key={link.name}>
              <NavLink myLinkHref={link.href} myLink={link.name} />
            </Fragment>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="sr-only">Auditro</span>
              </Link>
              {links.map((link) => (
                <Fragment key={link.name}>
                  <NavLink myLinkHref={link.href} myLink={link.name} />
                </Fragment>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4  justify-end md:gap-2 lg:gap-4">
          <Button variant={"secondary"} onClick={googleSignIn}>
            Sign in
          </Button>
        </div>
      </header>
    </>
  );
}
