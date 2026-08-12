import HeroActions from "./HeroActions";
import HeroSearch from "./HeroSearch";
import HeroStats from "./HeroStats";
import HeroTopics from "./HeroTopics";

const topics = [
  "Go",
  "React",
  "Next.js",
  "TypeScript",
  "Docker",
  "Flutter",
  "Kubernetes",
  "AI",
];

const stats = [
  { value: "Free Tools", title: "100% Client-Side" },
  { value: "Practical Guides", title: "Engineering Solutions" },
  { value: "Zero Latency", title: "Privacy First" },
  { value: "No Signup", title: "Instant Execution" },
];

export default function HeroSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border bg-muted px-4 py-1 text-xs font-semibold">
              ⚡ Learn • Solve • Build
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build Better Software
              <span className="block text-primary">
                with Confidence.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed">
              Master modern software development with practical tutorials,
              developer tools, troubleshooting guides, and curated learning resources.
            </p>

            <div className="mt-8">
              <HeroSearch placeholder="Search tutorials, tools, technologies..." />
            </div>

            <div className="mt-6">
              <HeroActions />
            </div>

            <div className="mt-8">
              <HeroTopics topics={topics} />
            </div>
          </div>

          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}