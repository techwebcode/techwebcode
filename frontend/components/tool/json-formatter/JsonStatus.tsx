import { CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { getJsonStats } from "./json.utils";

interface JsonStatusProps {
  valid: boolean;
  error?: string;
  value?: string;
}

export default function JsonStatus({ valid, error, value = "" }: JsonStatusProps) {
  if (!value.trim()) {
    return (
      <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-xs text-muted-foreground">
        <FileText className="h-4 w-4" />
        Paste or upload JSON data to validate and format.
      </div>
    );
  }

  if (valid) {
    const stats = getJsonStats(value);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs font-medium text-green-600 dark:text-green-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Valid JSON</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Type: {stats.isArray ? "Array" : "Object"}</span>
          <span>Keys: {stats.keysCount}</span>
          <span>Size: {(stats.bytes / 1024).toFixed(2)} KB ({stats.bytes} B)</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <span className="font-semibold">Invalid JSON Syntax:</span> {error}
        </div>
      </div>
    );
  }

  return null;
}