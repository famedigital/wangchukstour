import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wangchuks Tours & Treks - Discover the Last Shangri-La",
  description: "Experience authentic Bhutan with Wangchuks Tours & Treks. Cultural journeys, trekking adventures, and festival tours in the Land of the Thunder Dragon.",
  keywords: ["Bhutan tour", "Bhutan travel", "Bhutan trekking", "Bhutan festival", "Wangchuks Tours & Treks", "Bhutan adventures"],
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png",
        sizes: "any",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/hckgrdeh/image/upload/v1782962660/wangchukstlogo_usxclz.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        geist.variable,
        jakartaSans.variable,
        inter.variable,
        playfair.variable
      )}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
