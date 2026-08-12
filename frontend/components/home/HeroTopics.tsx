import Link from "next/link";

interface HeroTopicsProps {
  topics: string[];
}

export default function HeroTopics({
  topics,
}: HeroTopicsProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Popular Topics
      </p>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic}
            href={`/search?q=${encodeURIComponent(topic)}`}
            className="rounded-full border px-4 py-2 text-sm transition hover:bg-muted"
          >
            {topic}
          </Link>
        ))}
      </div>
    </div>
  );
}