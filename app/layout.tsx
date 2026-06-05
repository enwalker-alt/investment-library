import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Ellis Walker | Investment Research",
  description:
    "Personal equity research by a private markets analyst focused on public companies, business quality, capital allocation, intrinsic value, and long-term compounding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <GoogleAnalytics gaId="G-GM1HEQ2PTR" />
        <Analytics />
      </body>
    </html>
  );
}