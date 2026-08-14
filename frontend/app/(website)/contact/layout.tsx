import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TechWebCode for support, feedback, tool suggestions, or general inquiries.",
  alternates: {
    canonical: "https://techwebcode.in/contact",
  },
  openGraph: {
    title: "Contact Us | TechWebCode",
    description: "Get in touch with TechWebCode for support, feedback, tool suggestions, or general inquiries.",
    url: "https://techwebcode.in/contact",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
