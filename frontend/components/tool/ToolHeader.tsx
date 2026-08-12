import { Badge } from "@/components/ui/badge";
import { Tool } from "@/types/tools";

interface Props {
  tool?: Tool;
  title?: string;
  description?: string;
}

export default function ToolHeader({
  tool,
  title,
  description,
}: Props) {
  const displayTitle = title || tool?.name || "Developer Tool";
  const displayDesc = description || tool?.description || tool?.shortDescription || "";

  return (
    <header className="space-y-4">
      {tool && (
        <div className="flex flex-wrap gap-2">
          {tool.featured && <Badge>Featured</Badge>}
          {tool.popular && <Badge variant="secondary">Popular</Badge>}
          {tool.isNew && <Badge variant="outline">New</Badge>}
        </div>
      )}

      <h1 className="text-4xl font-bold">{displayTitle}</h1>

      {displayDesc && (
        <p className="max-w-3xl text-lg text-muted-foreground">{displayDesc}</p>
      )}
    </header>
  );
}