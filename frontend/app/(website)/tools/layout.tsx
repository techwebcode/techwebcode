import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer Tools Suite",
  description: "Fast, privacy-first developer tools that run directly in your browser including JSON formatters, JWT decoders, Base64 converters, and Generators.",
  alternates: {
    canonical: "https://techwebcode.in/tools",
  },
  openGraph: {
    title: "Free Developer Tools Suite | TechWebCode",
    description: "Fast, privacy-first developer tools that run directly in your browser including JSON formatters, JWT decoders, Base64 converters, and Generators.",
    url: "https://techwebcode.in/tools",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
