import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Airport Data — India's aviation network",
  description:
    "Interactive dashboard exploring 28+ Indian airports — passenger volumes, routes, cargo, and state-by-state statistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-white text-ink antialiased">
        <Navbar />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) history.scrollRestoration = 'manual';`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
