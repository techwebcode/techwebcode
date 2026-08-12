"use client";

import {
  Wand2,
  Minimize2,
  Maximize2,
  Copy,
  Trash2,
  Wrench,
  Download,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import JsonFileUpload from "./JsonFileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onFormat(): void;
  onMinify(): void;
  onAutoFix(): void;
  onLoadSample(): void;
  onFileUpload(content: string): void;
  onDownload(): void;
  onCopy(): void;
  onClear(): void;
  onToggleExpand(): void;
  isExpanded: boolean;
  indent: string;
  onIndentChange(value: string): void;
}

export default function JsonFormatterToolbar({
  onFormat,
  onMinify,
  onAutoFix,
  onLoadSample,
  onFileUpload,
  onDownload,
  onCopy,
  onClear,
  onToggleExpand,
  isExpanded,
  indent,
  onIndentChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-sm">
      {/* Primary Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onFormat} className="rounded-xl gap-2 font-medium">
          <Wand2 className="h-4 w-4" />
          Format
        </Button>

        <Button variant="secondary" onClick={onMinify} className="rounded-xl gap-2 font-medium">
          <Minimize2 className="h-4 w-4" />
          Minify
        </Button>

        <Button variant="outline" onClick={onAutoFix} className="rounded-xl gap-2 text-xs font-medium border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10">
          <Wrench className="h-3.5 w-3.5" />
          Auto-Fix
        </Button>

        <Button variant="ghost" onClick={onLoadSample} className="rounded-xl gap-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Load Sample
        </Button>

        <div className="flex items-center gap-2 border-l pl-2">
          <Select value={indent} onValueChange={(val) => onIndentChange(val ?? "2")}>
            <SelectTrigger className="h-9 w-[110px] rounded-xl text-xs">
              <SelectValue placeholder="Indent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Spaces</SelectItem>
              <SelectItem value="4">4 Spaces</SelectItem>
              <SelectItem value="tab">Tab</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex flex-wrap items-center gap-2">
        {!isExpanded && (
          <Button
            variant="outline"
            onClick={onToggleExpand}
            size="sm"
            className="rounded-xl gap-1.5 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Expand Editor
          </Button>
        )}

        <JsonFileUpload onLoad={onFileUpload} />

        <Button variant="outline" onClick={onDownload} size="sm" className="rounded-xl gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>

        <Button variant="outline" onClick={onCopy} size="sm" className="rounded-xl gap-1.5 text-xs">
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>

        <Button variant="ghost" onClick={onClear} size="sm" className="rounded-xl gap-1.5 text-xs text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>
    </div>
  );
}