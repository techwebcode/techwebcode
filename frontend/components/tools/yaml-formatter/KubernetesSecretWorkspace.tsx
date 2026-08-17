"use client";

import React, { useState, useMemo } from "react";
import { Tool } from "@/types/tools";
import ToolWorkspaceShell from "@/components/tool/workspace/ToolWorkspaceShell";
import K8sSecretDetectionPanel from "./K8sSecretDetectionPanel";
import K8sSecretValidationPanel from "./K8sSecretValidationPanel";
import K8sSecretModeControls, { K8sOperationMode } from "./K8sSecretModeControls";
import K8sSecretWorkspaceEditors from "./K8sSecretWorkspaceEditors";
import K8sSecretSummaryPanel from "./K8sSecretSummaryPanel";
import {
  SAMPLE_K8S_SECRET_YAML,
  detectKubernetesSecret,
  validateKubernetesSecret,
  transformKubernetesSecret,
  getSecretTransformationDetails,
  convertStringDataToData,
} from "./k8sSecret.utils";
import YAML from "yaml";
import { FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface KubernetesSecretWorkspaceProps {
  tool: Tool;
}

export default function KubernetesSecretWorkspace({ tool }: KubernetesSecretWorkspaceProps) {
  const [originalYaml, setOriginalYaml] = useState<string>(SAMPLE_K8S_SECRET_YAML);
  const [activeTab, setActiveTab] = useState<"k8s" | "general">("k8s");
  const [mode, setMode] = useState<K8sOperationMode>("decode");
  const [isMasked, setIsMasked] = useState<boolean>(false);

  // 1. Detect Secret Info
  const secretInfo = useMemo(() => {
    return detectKubernetesSecret(originalYaml);
  }, [originalYaml]);

  // 2. Validate Secret
  const validationResult = useMemo(() => {
    return validateKubernetesSecret(originalYaml);
  }, [originalYaml]);

  // 3. Transformation Breakdown Details
  const transformationSummary = useMemo(() => {
    return getSecretTransformationDetails(originalYaml, mode);
  }, [originalYaml, mode]);

  // 4. Process Manifest Result (Pure Client-Side AST preservation)
  const processedYaml = useMemo(() => {
    if (!originalYaml || !originalYaml.trim()) return "";

    if (activeTab === "general" || mode === "format") {
      try {
        const parsed = YAML.parse(originalYaml);
        return YAML.stringify(parsed, { indent: 2 });
      } catch {
        return originalYaml;
      }
    }

    return transformKubernetesSecret(originalYaml, mode);
  }, [originalYaml, mode, activeTab]);

  // Handlers
  const handleLoadSample = () => {
    setOriginalYaml(SAMPLE_K8S_SECRET_YAML);
  };

  const handleSwap = () => {
    setOriginalYaml(processedYaml);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(originalYaml);
    toast.success("Original Secret manifest copied!");
  };

  const handleCopyProcessed = () => {
    // ALWAYS copy real unmasked generated YAML
    navigator.clipboard.writeText(processedYaml);
    toast.success("Processed Secret manifest copied!");
  };

  const handleDownloadProcessed = () => {
    // ALWAYS download real unmasked generated YAML
    const blob = new Blob([processedYaml], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${secretInfo.name || "secret"}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Secret manifest downloaded!");
  };

  const handleConvertStringDataToData = () => {
    const updated = convertStringDataToData(originalYaml);
    setOriginalYaml(updated);
    setMode("encode");
  };

  return (
    <ToolWorkspaceShell
      tool={tool}
      valid={validationResult.valid}
      error={validationResult.errors[0]?.message}
      input={originalYaml}
      output={processedYaml}
      indent="2"
      onIndentChange={() => {}}
      onFormat={() => setMode("format")}
      onMinify={() => {}}
      onValidate={() => {}}
      onLoadSample={handleLoadSample}
      onFileUpload={(content) => setOriginalYaml(content)}
      onCopy={handleCopyProcessed}
      onDownload={handleDownloadProcessed}
      isClientSideOnly={true}
    >
      <div className="space-y-4 w-full min-w-0">
        {/* Workspace Mode Selector Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("k8s")}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "k8s"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Kubernetes Secret Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "general"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>General YAML Formatter</span>
            </button>
          </div>
        </div>

        {/* 1. Detection Panel */}
        {activeTab === "k8s" && <K8sSecretDetectionPanel info={secretInfo} />}

        {/* 2. Validation Diagnostics */}
        <K8sSecretValidationPanel result={validationResult} />

        {/* 3. Mode Controls Bar (Encode, Decode, Double-Encoding Safeguard) */}
        {activeTab === "k8s" && (
          <K8sSecretModeControls
            mode={mode}
            onModeChange={setMode}
            info={secretInfo}
            isMasked={isMasked}
            onToggleMask={() => setIsMasked(!isMasked)}
            onConvertStringDataToData={handleConvertStringDataToData}
            onForceEncodeAnyway={() => setMode("encode")}
          />
        )}

        {/* 4. Main Dual-Panel Workspace Editors */}
        <div className="grid gap-4 lg:grid-cols-4 min-w-0">
          <div className="lg:col-span-3 min-w-0 space-y-4">
            <K8sSecretWorkspaceEditors
              originalYaml={originalYaml}
              processedYaml={processedYaml}
              onOriginalChange={setOriginalYaml}
              onSwap={handleSwap}
              onCopyOriginal={handleCopyOriginal}
              onCopyProcessed={handleCopyProcessed}
              isMasked={isMasked}
              mode={mode}
              transformedCount={transformationSummary.transformedCount}
            />
          </div>

          {/* Right Summary & Security Side Panel */}
          <div className="lg:col-span-1 min-w-0">
            <K8sSecretSummaryPanel
              info={secretInfo}
              mode={mode}
              summary={transformationSummary}
              onCopyProcessed={handleCopyProcessed}
              onDownloadProcessed={handleDownloadProcessed}
            />
          </div>
        </div>
      </div>
    </ToolWorkspaceShell>
  );
}
