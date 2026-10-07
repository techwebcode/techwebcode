import { Metadata } from "next";
import PlaygroundPageContainer from "@/components/playground/PlaygroundPageContainer";
import { LANGUAGES } from "@/components/playground/languages.config";

export const metadata: Metadata = {
  title: "Multi-Language Online Code Playground & Compiler | TechWebCode",
  description:
    "Free online code playground and compiler for HTML5, CSS3, JavaScript, TypeScript, Python 3, Java, C, C++, Go, PHP, and Rust with Monaco VS Code editor and instant preview.",
  keywords: [
    "online code playground",
    "online compiler",
    "multi language code playground",
    "HTML CSS JS playground",
    "Python online compiler",
    "Go playground",
    "Java online compiler",
  ],
};

export default function PlaygroundLandingPage() {
  return <PlaygroundPageContainer languageConfig={LANGUAGES.html} />;
}
