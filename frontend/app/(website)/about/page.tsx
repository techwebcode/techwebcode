import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Code2, Cpu, Globe, Zap, ShieldCheck, HeartHandshake, Terminal, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About TechWebCode — Platform Mission & Architecture",
  description:
    "Learn more about TechWebCode, our developer-first mission, privacy principles, and client-side web utility engineering.",
  alternates: {
    canonical: "https://techwebcode.in/about",
  },
  openGraph: {
    title: "About TechWebCode — Platform Mission & Architecture",
    description:
      "Learn more about TechWebCode, our developer-first mission, privacy principles, and client-side web utility engineering.",
    url: "https://techwebcode.in/about",
    siteName: "TechWebCode",
    type: "website",
  },
};

const features = [
  {
    icon: Code2,
    title: "High-Quality Tutorials",
    description: "In-depth, real-world coding guides covering modern web frameworks, systems programming, and architecture.",
  },
  {
    icon: Zap,
    title: "Instant Utilities & Tools",
    description: "Privacy-first, browser-based online tools including JSON formatters, JWT decoders, Base64 converters, and generators.",
  },
  {
    icon: ShieldCheck,
    title: "Client-Side Processing",
    description: "Interactive tools execute locally in your browser. Sensitive payloads and tokens are never transmitted to our backend.",
  },
  {
    icon: Globe,
    title: "Open Knowledge",
    description: "Free and accessible technical insights designed for modern web developers, software engineers, and architects.",
  },
];

const techStack = [
  { name: "Next.js 16", category: "Frontend Framework", icon: Layers },
  { name: "TypeScript 5", category: "Type Safety", icon: Code2 },
  { name: "Go (Golang)", category: "Backend Microservices", icon: Terminal },
  { name: "MySQL & GORM", category: "Database & Storage", icon: Cpu },
];

export default function AboutPage() {
  const breadcrumbItems = [{ label: "About Us" }];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://techwebcode.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://techwebcode.in/about",
      },
    ],
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TechWebCode",
    description:
      "TechWebCode provides high-performance online developer tools, technical articles, and architectural guides.",
    url: "https://techwebcode.in/about",
  };

  return (
    <div className="space-y-16 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Hero Header */}
      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-12 pt-4">
        <Container className="space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="text-center space-y-4 pt-2">
            <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
              💡 Engineering & Web Innovation
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              About TechWebCode
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              TechWebCode is a modern developer platform dedicated to providing high-performance online developer tools, technical articles, and architectural guides.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="space-y-16">
        {/* Mission Section */}
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Empowering Developers with Speed & Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We built TechWebCode with a clear mission: to eliminate friction from daily software engineering workflows. Whether you need to inspect JSON payloads, decode authentication tokens, format code snippets, or learn modern architectural patterns, TechWebCode provides fast, reliable, and privacy-focused utilities.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">100% Free Access</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Client-Side Processing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center rounded-2xl bg-card/60 border">
              <CardContent className="p-0 space-y-2">
                <span className="text-4xl font-bold text-primary">14+</span>
                <p className="text-sm font-medium text-muted-foreground">Developer Tools</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center rounded-2xl bg-card/60 border">
              <CardContent className="p-0 space-y-2">
                <span className="text-4xl font-bold text-primary">100%</span>
                <p className="text-sm font-medium text-muted-foreground">In-Browser Privacy</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center rounded-2xl bg-card/60 border">
              <CardContent className="p-0 space-y-2">
                <span className="text-4xl font-bold text-primary">⚡</span>
                <p className="text-sm font-medium text-muted-foreground">High Speed</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center rounded-2xl bg-card/60 border">
              <CardContent className="p-0 space-y-2">
                <span className="text-4xl font-bold text-primary">24/7</span>
                <p className="text-sm font-medium text-muted-foreground">Global Availability</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-10">
          <SectionHeading
            title="Core Platform Features"
            description="Built to deliver exceptional user experience and performance."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="rounded-2xl border p-6 hover:shadow-md transition-shadow">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-3xl border bg-card p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Powered by Modern Technologies</h2>
            <p className="text-sm text-muted-foreground">Our engineering architecture ensures ultra-fast page loads and responsive UI.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="flex items-center gap-3 p-4 rounded-xl border bg-background/50">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{tech.name}</h4>
                    <span className="text-xs text-muted-foreground">{tech.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
