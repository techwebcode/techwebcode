import React, { useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
  findingId: string;
  originalSnippet?: string;
  recommendedFix: string;
}

export default function DiffFixView({ findingId, originalSnippet, recommendedFix }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recommendedFix);
    setCopied(true);
    toast.success("Copied recommended fix to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 pt-2 border-t border-border/50 font-sans text-xs">
      <div className="flex items-center justify-between font-bold text-foreground">
        <span>Recommended Fix & Code Diff:</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Fix"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {originalSnippet && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
              Current Problematic Directive
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 font-mono text-[11px] text-rose-600 dark:text-rose-400 break-all">
              {originalSnippet}
            </div>
          </div>
        )}

        <div className="space-y-1 md:col-span-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Recommended Change
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 break-all">
            {recommendedFix}
          </div>
        </div>
      </div>
    </div>
  );
}
