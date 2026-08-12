"use client";

import { Copy, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onCopy?: () => void;
  onClear?: () => void;
}

export default function ToolActions({
  onCopy,
  onClear,
}: Props) {
  return (
    <div className="flex gap-2">

      <Button
        variant="outline"
        onClick={onCopy}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>

      <Button
        variant="outline"
        onClick={onClear}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear
      </Button>

    </div>
  );
}