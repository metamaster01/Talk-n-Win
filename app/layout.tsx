import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talk&Win App - Boost your Personality & Communication Skills",
  description: "Join Talk&Win to enhance your communication skills, build confidence, and unlock new opportunities. Start your journey today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.className} ${poppins.className} antialiased`}
      >
      <Navigation />
        {children}
        <Analytics />

      <Footer />
      </body>
    </html>
  );
}
