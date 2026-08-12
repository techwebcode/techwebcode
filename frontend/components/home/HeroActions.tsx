import Link from "next/link";

interface HeroActionsProps {
  primaryHref?: string;
  secondaryHref?: string;
}

export default function HeroActions({
  primaryHref = "/articles",
  secondaryHref = "/tools",
}: HeroActionsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href={primaryHref}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Explore Tutorials
      </Link>

      <Link
        href={secondaryHref}
        className="rounded-lg border px-6 py-3 text-sm font-semibold transition hover:bg-muted"
      >
        Developer Tools
      </Link>
    </div>
  );
}