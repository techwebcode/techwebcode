"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Key, Server, Database, Layers } from "lucide-react";
import { K8sSecretInfo } from "./k8sSecret.utils";

interface K8sSecretDetectionPanelProps {
  info: K8sSecretInfo;
}

export default function K8sSecretDetectionPanel({ info }: K8sSecretDetectionPanelProps) {
  if (!info.isKubernetesSecret) return null;

  return (
    <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 sm:p-4 text-blue-950 dark:text-blue-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Detection Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>✓ Kubernetes Secret Detected</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Manifest parsed & validated locally in browser.
            </p>
          </div>
        </div>

        {/* Metadata Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Name: <strong>{info.name}</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Namespace: <strong>{info.namespace}</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            <Database className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Type: <strong>{info.secretType}</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            <Key className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Keys: <strong>{info.totalKeys}</strong> ({info.storageType})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
