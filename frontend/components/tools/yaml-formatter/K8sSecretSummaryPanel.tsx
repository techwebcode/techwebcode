"use client";

import React from "react";
import { Activity, ShieldAlert, CheckCircle2, Copy, Download, Info } from "lucide-react";
import { K8sSecretInfo, SecretTransformationSummary } from "./k8sSecret.utils";
import { K8sOperationMode } from "./K8sSecretModeControls";
import { Button } from "@/components/ui/button";

interface K8sSecretSummaryPanelProps {
  info: K8sSecretInfo;
  mode: K8sOperationMode;
  summary: SecretTransformationSummary;
  onCopyProcessed: () => void;
  onDownloadProcessed: () => void;
}

export default function K8sSecretSummaryPanel({
  info,
  mode,
  summary,
  onCopyProcessed,
  onDownloadProcessed,
}: K8sSecretSummaryPanelProps) {
  if (!info.isKubernetesSecret) return null;

  const operationText =
    mode === "decode"
      ? "Decode (Base64 → Plaintext)"
      : mode === "encode"
      ? "Encode (Plaintext → Base64)"
      : "Format YAML";

  return (
    <div className="space-y-4">
      {/* Secret Analysis & Transformation Summary Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>SECRET ANALYSIS</span>
          </div>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            title="Metadata, labels, annotations, and other manifest fields are preserved during transformation."
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>✓ Manifest Structure Preserved</span>
          </span>
        </div>

        {/* Metadata Details */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Manifest Name:</span>
            <strong className="font-bold text-slate-900 dark:text-slate-100">{info.name}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Namespace:</span>
            <strong className="font-bold text-slate-900 dark:text-slate-100">{info.namespace}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Secret Type:</span>
            <strong className="font-bold text-slate-900 dark:text-slate-100">{info.secretType}</strong>
          </div>
          <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Secret Values:</span>
            <strong className="font-bold text-blue-600 dark:text-blue-400">
              {summary.detectedCount} detected · {summary.transformedCount} transformed
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Operation:</span>
            <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">{operationText}</strong>
          </div>
        </div>

        {/* Transformation Itemized Breakdown */}
        {summary.details.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Per-Key Transformation Breakdown:
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {summary.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-100/70 dark:bg-slate-800/80 text-[11px] font-mono"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                    ✓ {detail.key}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                    {detail.from} → {detail.to}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons: Solid Blue Primary Copy Result */}
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            onClick={onCopyProcessed}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md gap-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Result Manifest</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onDownloadProcessed}
            className="w-full h-8 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download YAML</span>
          </Button>
        </div>
      </div>

      {/* Security Educational Notice */}
      <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 text-amber-950 dark:text-amber-200 text-xs space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 font-extrabold text-amber-900 dark:text-amber-100">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>🔐 Base64 is Encoding, NOT Encryption</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Base64 is encoding, not encryption. Anyone with access to the Secret manifest can decode these values. For production secrets, consider encryption at rest, KMS, Sealed Secrets, or Vault.
        </p>
      </div>
    </div>
  );
}
