import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans - Modern, professional headings
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Inter - Clean, readable body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Playfair Display - Cultural elegance for accents
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wangchuk Tours & Treks - Discover the Last Shangri-La",
  description: "Experience authentic Bhutan with Wangchuk Tours & Treks. Cultural journeys, trekking adventures, and festival tours in the Land of the Thunder Dragon.",
  keywords: ["Bhutan tour", "Bhutan travel", "Bhutan trekking", "Bhutan festival", "Wangchuk Tours & Treks", "Bhutan adventures"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
