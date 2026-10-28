"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, Layers } from "lucide-react";
import { SqlValidationResult } from "./sqlEngine";

interface SqlValidationPanelProps {
  validationResult: SqlValidationResult | null;
  onClose?: () => void;
}

export default function SqlValidationPanel({ validationResult }: SqlValidationPanelProps) {
  if (!validationResult || validationResult.isValid === null) {
    return null;
  }

  const { isValid, statementCount, statements, error, dialectUsed, note } = validationResult;

  if (isValid) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 animate-in fade-in duration-150">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-emerald-400">
                Valid SQL Syntax ({dialectUsed})
              </span>
              <p className="text-xs text-emerald-500/80">
                {statementCount} {statementCount === 1 ? "statement" : "statements"} parsed successfully by AST parser.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            AST Verified
          </span>
        </div>

        {statements && statements.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Layers className="w-3 h-3" /> Detected Operations:
            </span>
            {statements.map((st, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-muted/60 text-foreground border border-border"
              >
                <span className="font-bold text-blue-400">{st.type}</span>
                {st.table && <span className="text-muted-foreground">on {st.table}</span>}
              </span>
            ))}
          </div>
        )}

        {note && (
          <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground bg-background/40 p-2 rounded-lg border border-border/40">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
            <span>{note}</span>
          </div>
        )}
      </div>
    );
  }

  // Invalid syntax state
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-3 animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-rose-400">
              SQL Syntax Error Detected
            </span>
            {error?.line && (
              <p className="text-xs text-rose-400/80 font-mono">
                Location: Line {error.line}, Column {error.column} ({dialectUsed})
              </p>
            )}
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Syntax Failed
        </span>
      </div>

      {error?.message && (
        <div className="text-xs font-mono text-rose-300 bg-black/40 p-3 rounded-lg border border-rose-500/20 leading-relaxed break-all">
          {error.message}
        </div>
      )}

      {error?.lineSnippet && (
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Error Context Snippet:
          </div>
          <pre className="text-xs font-mono bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
            <div>{error.lineSnippet}</div>
            <div className="text-rose-400 font-bold">{error.pointerSnippet}</div>
          </pre>
        </div>
      )}

      {note && (
        <div className="text-[11px] text-muted-foreground bg-background/40 p-2 rounded-lg border border-border/40 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span>{note}</span>
        </div>
      )}
    </div>
  );
}
