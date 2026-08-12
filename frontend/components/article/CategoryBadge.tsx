import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  readonly name: string;
  readonly slug: string;
  readonly clickable?: boolean;
}

export default function CategoryBadge({
  name,
  slug,
  clickable = false,
}: Readonly<Props>) {
  if (clickable) {
    return (
      <Link href={`/categories/${slug}`}>
        <Badge className="hover:bg-primary hover:text-primary-foreground transition-colors">
          {name}
        </Badge>
      </Link>
    );
  }

  return (
    <Badge variant="secondary" className="font-semibold text-[10px] tracking-wide">
      {name}
    </Badge>
  );
}