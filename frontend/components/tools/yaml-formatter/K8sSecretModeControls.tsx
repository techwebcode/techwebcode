"use client";

import React, { useState } from "react";
import { Lock, Unlock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { K8sSecretInfo } from "./k8sSecret.utils";

export type K8sOperationMode = "encode" | "decode" | "format";

interface K8sSecretModeControlsProps {
  mode: K8sOperationMode;
  onModeChange: (mode: K8sOperationMode) => void;
  info: K8sSecretInfo;
  isMasked: boolean;
  onToggleMask: () => void;
  onConvertStringDataToData: () => void;
  onForceEncodeAnyway: () => void;
}

export default function K8sSecretModeControls({
  mode,
  onModeChange,
  info,
  isMasked,
  onToggleMask,
  onConvertStringDataToData,
  onForceEncodeAnyway,
}: K8sSecretModeControlsProps) {
  const [suppressDoubleEncodeWarning, setSuppressDoubleEncodeWarning] = useState(false);

  const showDoubleEncodeWarning =
    mode === "encode" && info.isAlreadyBase64 && !suppressDoubleEncodeWarning;

  return (
    <div className="space-y-3">
      {/* Elevated Operation Hierarchy Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Primary Operation Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            OPERATION:
          </span>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setSuppressDoubleEncodeWarning(false);
                onModeChange("decode");
              }}
              className={`px-3.5 py-1.5 rounded-lg font-extrabold transition-all flex items-center gap-1.5 text-xs ${
                mode === "decode"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Decode (Base64 → Plaintext)</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange("encode")}
              className={`px-3.5 py-1.5 rounded-lg font-extrabold transition-all flex items-center gap-1.5 text-xs ${
                mode === "encode"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Encode (Plaintext → Base64)</span>
            </button>
          </div>
        </div>

        {/* Secondary Utilities & Secret Visibility */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Advanced Action: Convert stringData -> data */}
          {info.stringDataCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onConvertStringDataToData}
              className="h-8 px-2.5 rounded-lg border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold gap-1"
            >
              <span>Convert stringData → data</span>
            </Button>
          )}

          {/* Secret Value Visibility Toggle (Show Values / Hide Values) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleMask}
            className="h-8 px-3 rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold gap-1.5"
            title={isMasked ? "Reveal Secret Values" : "Mask Secret Values"}
          >
            {isMasked ? (
              <>
                <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>👁 Show Values</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                <span>🙈 Hide Values</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Double-Encoding Prevention Safeguard Warning Banner */}
      {showDoubleEncodeWarning && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-amber-950 dark:text-amber-200 text-xs space-y-2 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-amber-900 dark:text-amber-100">
                ⚠ Double-Encoding Prevention Guard
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-normal">
                The values inside <code className="bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">data:</code> already appear to be valid Base64 encoded strings. Encoding them again may produce unintended double-encoded values.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onModeChange("decode");
                  }}
                  className="h-7 px-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-lg shadow-sm"
                >
                  Decode Instead
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSuppressDoubleEncodeWarning(true);
                    onForceEncodeAnyway();
                  }}
                  className="h-7 px-3 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100 font-bold text-xs rounded-lg"
                >
                  Encode Anyway
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
