import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "Free Online Developer Tools & Code Compilers | TechWebCode",
  },
  description:
    "Fast, free online developer tools and code compilers. Format JSON, decode JWT, test Regex, convert timestamps, and run code in 10+ languages with browser-based execution.",
  alternates: {
    canonical: "https://techwebcode.in",
  },
  openGraph: {
    title: "Free Online Developer Tools & Code Compilers | TechWebCode",
    description:
      "Fast, free online developer tools and code compilers. Format JSON, decode JWT, test Regex, convert timestamps, and run code in 10+ languages with browser-based execution.",
    url: "https://techwebcode.in",
    siteName: "TechWebCode",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechWebCode — Free Online Developer Tools & Code Compilers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Developer Tools & Code Compilers | TechWebCode",
    description:
      "Fast, free online developer tools and code compilers. Format JSON, decode JWT, test Regex, convert timestamps, and run code in 10+ languages with browser-based execution.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <HomePage />;
}