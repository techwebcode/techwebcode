import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ToolSidebar() {
  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Related Tools
        </CardTitle>
      </CardHeader>

      <CardContent>

        <p className="text-sm text-muted-foreground">
          Related tools will be loaded here.
        </p>

      </CardContent>

    </Card>
  );
}