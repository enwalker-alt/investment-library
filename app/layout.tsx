import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ellis Walker",
  description:
    "Investment letters, philosophy, background, and contact information for Ellis Walker.",
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
        <footer className="site-footer">
          <div className="footer-inner">
            <p>© {new Date().getFullYear()} Ellis Walker</p>
            <p>Personal research. Not investment advice.</p>
          </div>
        </footer>
        <GoogleAnalytics gaId="G-GM1HEQ2PTR" />
        <Analytics />
      </body>
    </html>
  );
}
