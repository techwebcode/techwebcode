import { Tool } from "@/types/tools";
import ToolCard from "./ToolCard";

interface ToolGridProps {
  tools: Tool[];
}

export default function ToolGrid({
  tools = [],
}: ToolGridProps) {
  const toolList = Array.isArray(tools) ? tools : [];

  if (!toolList.length) {
    return (
      <div className="rounded-xl border py-12 text-center text-muted-foreground">
        No tools found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {toolList.map((tool) => {
        const badge = tool.isNew || tool.is_new ? "New" : tool.popular ? "Popular" : undefined;
        const description = tool.shortDescription || tool.short_description || tool.description || "";
        const categoryName = tool.category?.name;

        return (
          <ToolCard
            key={tool.id || tool.slug}
            name={tool.name}
            slug={tool.slug}
            description={description}
            category={categoryName}
            icon={tool.icon}
            featured={tool.featured}
            badge={badge}
          />
        );
      })}
    </div>
  );
}