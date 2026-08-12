import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  description,
  href,
  actionLabel = "View All",
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        centered ? "items-center text-center" : ""
      }`}
    >
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
        >
          {actionLabel}

          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}