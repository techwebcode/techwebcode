import { Tool } from "@/types/tools";
import { getToolComponent } from "./ToolRegistry";
import ComingSoon from "./ComingSoon";

interface Props {
  tool: Tool;
}

export default function ToolRenderer({ tool }: Props) {
  if (!tool) {
    return null;
  }

  const Component = getToolComponent(tool.slug);

  if (Component) {
    return <Component tool={tool} />;
  }

  return <ComingSoon tool={tool} />;
}