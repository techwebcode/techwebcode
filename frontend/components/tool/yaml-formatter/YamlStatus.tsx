import { CheckCircle2, AlertCircle, FileCode } from "lucide-react";
import { getYamlStats } from "./yaml.utils";

interface YamlStatusProps {
  valid: boolean;
  error?: string;
  value?: string;
}

export default function YamlStatus({ valid, error, value = "" }: YamlStatusProps) {
  if (!value.trim()) {
    return (
      <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-xs text-muted-foreground">
        <FileCode className="h-4 w-4" />
        Paste or upload YAML configuration to validate, format, or encode/decode secrets.
      </div>
    );
  }

  if (valid) {
    const stats = getYamlStats(value);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs font-medium text-green-600 dark:text-green-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Valid YAML Syntax</span>
          {stats.isK8sSecret && (
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-300">
              K8s Secret Detected
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
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
          <span className="font-semibold">Invalid YAML Syntax:</span> {error}
        </div>
      </div>
    );
  }

  return null;
}
