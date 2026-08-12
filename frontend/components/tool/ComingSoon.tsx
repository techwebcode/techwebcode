import { Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import ToolHeader from "./ToolHeader";
import ToolLayout from "./ToolLayout";
import { Tool } from "@/types/tools";

interface Props {
  tool: Tool;
}

export default function ComingSoon({
  tool,
}: Props) {
  return (
    <ToolLayout>

      <ToolHeader tool={tool} />

      <Card>

        <CardContent className="flex flex-col items-center py-20 text-center">

          <Wrench className="mb-6 h-12 w-12 text-muted-foreground" />

          <h2 className="text-2xl font-semibold">
            Coming Soon
          </h2>

          <p className="mt-4 max-w-lg text-muted-foreground">
            This developer tool is currently under development and will be available soon.
          </p>

        </CardContent>

      </Card>

    </ToolLayout>
  );
}