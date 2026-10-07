import { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaygroundPageContainer from "@/components/playground/PlaygroundPageContainer";
import { LANGUAGES, getLanguageConfig } from "@/components/playground/languages.config";

interface Props {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((slug) => ({
    lang: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = (resolvedParams.lang || "").toLowerCase().trim();

  if (!LANGUAGES[slug]) {
    return {
      title: "Playground | TechWebCode",
    };
  }

  const config = LANGUAGES[slug];
  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
    openGraph: {
      title: config.seo.title,
      description: config.seo.description,
    },
  };
}

export default async function LanguagePlaygroundPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = (resolvedParams.lang || "").toLowerCase().trim();

  if (!LANGUAGES[slug]) {
    notFound();
  }

  const config = getLanguageConfig(slug);

  return <PlaygroundPageContainer languageConfig={config} />;
}
