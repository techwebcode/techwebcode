import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  readonly title: string;
  readonly description?: string;
  readonly href?: string;
  readonly linkText?: string;
  readonly actionLabel?: string;
  readonly className?: string;
}

export default function SectionHeading({
  title,
  description,
  href,
  linkText,
  actionLabel,
  className,
}: Readonly<Props>) {
  const displayLinkText = actionLabel || linkText || "View All";

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-all hover:gap-2 shrink-0"
        >
          <span>{displayLinkText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}