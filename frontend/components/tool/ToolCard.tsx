import Link from "next/link";
import {
  LucideIcon,
  ArrowRight,
  Braces,
  Code2,
  KeyRound,
  Binary,
  Hash,
  Clock3,
  Wrench,
  FileCode,
  Terminal,
  Cpu,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "code-bracket": Braces,
  "code": Code2,
  "key": KeyRound,
  "binary": Binary,
  "hash": Hash,
  "clock": Clock3,
  "wrench": Wrench,
  "file-code": FileCode,
  "terminal": Terminal,
  "cpu": Cpu,
};

export interface ToolCardProps {
  name: string;
  slug: string;
  description: string;
  icon?: LucideIcon | string;
  category?: string;
  badge?: string;
  featured?: boolean;
}

export default function ToolCard({
  name,
  slug,
  description,
  icon,
  category,
  badge,
  featured = false,
}: ToolCardProps) {
  let IconComponent: LucideIcon = Wrench;

  if (typeof icon === "string" && ICON_MAP[icon]) {
    IconComponent = ICON_MAP[icon];
  } else if (typeof icon === "function" || typeof icon === "object") {
    IconComponent = icon as LucideIcon;
  }

  return (
    <Link
      href={`/tools/${slug}`}
      className={`group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg ${
        featured ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <IconComponent className="h-6 w-6" />
        </div>

        {badge && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
          {name}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        {category ? (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {category}
          </span>
        ) : (
          <span />
        )}

        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}