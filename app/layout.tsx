import type { Metadata, Viewport } from "next";
import { Open_Sans, Work_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import StoreProvider from "@/components/provider";
import Navbar from "@/components/navbar";
const inter = Montserrat({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: "Picks - Movie and TV Show Recommendations",
    template: "%s - Picks",
  },
  description:
    "Discover your next favorite movie or TV show with Picks. Personalized recommendations and search for all your viewing needs.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Picks - Movie and TV Show Recommendations",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Picks",
    title: {
      default: "Picks - Movie and TV Show Recommendations",
      template: "%s - Picks",
    },
    description:
      "Discover your next favorite movie or TV show with Picks. Personalized recommendations and search for all your viewing needs.",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Picks - Movie and TV Show Recommendations",
      template: "%s - Picks",
    },
    description:
      "Discover your next favorite movie or TV show with Picks. Personalized recommendations and search for all your viewing needs.",
  },
};
export const viewport: Viewport = {
  themeColor: "0 72.2% 50.6%",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
