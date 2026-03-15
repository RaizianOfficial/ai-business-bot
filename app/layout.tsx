import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Gift Hamper Order Assistant",
  description: "Order your favorite gift hampers with the help of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617] text-white min-h-screen selection:bg-primary/30`}>
        {children}
      </body>
    </html>
  );
}
