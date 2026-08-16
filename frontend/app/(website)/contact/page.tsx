import { Metadata } from "next";
import ContactFormContent from "./ContactFormContent";

export const metadata: Metadata = {
  title: "Contact TechWebCode — Developer Tools & Technical Support",
  description:
    "Contact TechWebCode for technical questions, bug reports, feature requests, developer tool feedback, and business inquiries.",
  openGraph: {
    title: "Contact TechWebCode — Developer Tools & Technical Support",
    description:
      "Contact TechWebCode for technical questions, bug reports, feature requests, developer tool feedback, and business inquiries.",
    url: "https://techwebcode.in/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://techwebcode.in/contact",
  },
};

export default function ContactPage() {
  return <ContactFormContent />;
}
