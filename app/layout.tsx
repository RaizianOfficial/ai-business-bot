import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

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
      <body className={`${outfit.className} bg-[#020617] text-white min-h-screen selection:bg-primary/30`}>
        {children}
      </body>
    </html>
  );
}

