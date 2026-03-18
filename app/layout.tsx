import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Velourah - Premium Gift Hampers",
  description: "Order premium curated gift hampers for every occasion. AI-powered ordering, fast delivery across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-background text-textDark min-h-screen selection:bg-primary/20 font-sans font-light`}>
        {children}
      </body>
    </html>
  );
}
