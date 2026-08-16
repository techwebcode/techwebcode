"use client";

import React, { useState, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileCode,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Download,
  Trash2,
  Check,
  Copy,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { ProjectFile, Finding, AnalysisReport, FindingSeverity } from "./types";
import { parseUploadedInput } from "./parser";
import { runAnalyzerEngine } from "./engine";
import RelationshipGraphView from "./RelationshipGraphView";
import DiffFixView from "./DiffFixView";

interface Props {
  readonly tool: Tool;
}

export default function DeploymentConfigDoctor({ tool }: Props) {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedFilePreview, setSelectedFilePreview] = useState<ProjectFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    try {
      const parsedFiles = await parseUploadedInput(files);
      if (parsedFiles.length === 0) {
        toast.error("No supported configuration files found in selection");
        setIsAnalyzing(false);
        return;
      }

      const generatedReport = runAnalyzerEngine(parsedFiles);
      setReport(generatedReport);
      setSelectedFilePreview(parsedFiles[0] || null);
      toast.success(`Analyzed ${parsedFiles.length} project file(s) successfully!`);
    } catch (err: any) {
      toast.error(`Analysis failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleExportJson = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deployment-config-audit-report.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded JSON Audit Report!");
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    let md = `# Deployment Config Audit Report\n\n`;
    md += `**Deployment Health Score**: ${report.healthScore} / 100\n`;
    md += `**Errors**: ${report.errorCount} | **Warnings**: ${report.warningCount} | **Passed**: ${report.passCount}\n\n`;
    md += `## Findings\n\n`;

    report.findings.forEach((f, idx) => {
      md += `### ${idx + 1}. [${f.severity.toUpperCase()}] ${f.title}\n`;
      md += `- **Rule**: \`${f.ruleId}\` (Confidence: ${f.confidence || "High"})\n`;
      md += `- **Affected File**: \`${f.affectedFile}\` ${f.lineNumber ? `Line ${f.lineNumber}` : ""}\n`;
      md += `- **Explanation**: ${f.explanation}\n`;
      if (f.recommendedFix) {
        md += `- **Recommended Fix**: \`${f.recommendedFix}\`\n`;
      }
      md += `\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deployment-config-audit-report.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Markdown Audit Report!");
  };

  const handleReset = () => {
    setReport(null);
    setSelectedFilePreview(null);
    toast.info("Cleared analysis workspace");
  };

  const filteredFindings = report?.findings.filter((f) => {
    if (activeTab === "all") return true;
    if (activeTab === "error" || activeTab === "warning" || activeTab === "pass") {
      return f.severity === activeTab;
    }
    return f.ruleId.startsWith(activeTab.toUpperCase().slice(0, 3));
  });

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Privacy Guarantee Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">100% Private Local Browser Analysis</div>
          <div className="opacity-90 leading-relaxed">
            🔒 Your project files are analyzed locally in your browser. Nothing is uploaded to TechWebCode. Secrets, API keys, and configuration contents remain on your device.
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!report && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border hover:border-primary/60 bg-card/50 hover:bg-card p-8 sm:p-12 rounded-3xl text-center space-y-4 transition-all cursor-pointer shadow-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.env,.yml,.yaml,.json,.conf,.dockerfile,Dockerfile"
            onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">
              Drop Project ZIP or Configuration Files
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Supports <code>.env</code>, <code>docker-compose.yml</code>, <code>Dockerfile</code>, <code>nginx.conf</code>, <code>next.config.js</code>, <code>package.json</code>, <code>GitHub Actions</code>, and <code>Kubernetes YAML</code> manifests.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isAnalyzing}
              className="rounded-xl px-5 gap-2 text-xs font-semibold"
            >
              <FileCode className="w-4 h-4" />
              <span>{isAnalyzing ? "Analyzing Project..." : "Select Files or ZIP"}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Results Dashboard */}
      {report && (
        <div className="space-y-6">
          {/* Health Score & Export Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-4">
              {/* Circular Health Score Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shadow ${
                    report.healthScore >= 80
                      ? "bg-emerald-500"
                      : report.healthScore >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                >
                  {report.healthScore}
                </div>

                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Deployment Health Score</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.healthScore >= 80
                      ? "Excellent configuration topology"
                      : report.healthScore >= 50
                      ? "Action required before deployment"
                      : "Critical deployment errors detected"}
                  </div>
                </div>
              </div>
            </div>

            {/* Export Buttons & Reset */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportMarkdown}
                className="h-9 text-xs gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown Report</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="h-9 text-xs gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 px-3 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All Findings ({report.findings.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("error")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "error" ? "bg-rose-500 text-white shadow" : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>🔴 {report.errorCount} Errors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("warning")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "warning" ? "bg-amber-500 text-white shadow" : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>🟠 {report.warningCount} Warnings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pass")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "pass" ? "bg-emerald-500 text-white shadow" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>🟢 {report.passCount} Passed</span>
            </button>
          </div>

          {/* Interactive Relationship Graph */}
          <RelationshipGraphView files={report.files} findings={report.findings} />

          {/* Main Workspace Grid: Findings & File Explorer */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Filtered Findings List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Diagnostic Audit Report</span>
              </h3>

              {filteredFindings && filteredFindings.length > 0 ? (
                filteredFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`p-5 rounded-2xl border bg-card space-y-3 shadow-sm transition-all ${
                      finding.severity === "error"
                        ? "border-rose-500/40 bg-rose-500/5"
                        : finding.severity === "warning"
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-emerald-500/40 bg-emerald-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                              finding.severity === "error"
                                ? "bg-rose-500 text-white"
                                : finding.severity === "warning"
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-500 text-white"
                            }`}
                          >
                            {finding.severity}
                          </span>

                          <span className="font-mono text-xs text-muted-foreground">
                            {finding.ruleId}
                          </span>

                          {finding.confidence && (
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                finding.confidence === "High"
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : finding.confidence === "Medium"
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {finding.confidence} Confidence
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-foreground">{finding.title}</h4>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {finding.explanation}
                    </div>

                    {/* Affected File & Line Number */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                      <span className="text-muted-foreground font-sans font-semibold">
                        Affected File:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-medium">
                        {finding.affectedFile}
                        {finding.lineNumber ? `:${finding.lineNumber}` : ""}
                      </span>
                    </div>

                    {/* Recommended Fix Diff View */}
                    {finding.recommendedFix && (
                      <DiffFixView
                        findingId={finding.id}
                        originalSnippet={finding.originalSnippet}
                        recommendedFix={finding.recommendedFix}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl border bg-card text-center text-xs text-muted-foreground italic">
                  No findings matching selected filter.
                </div>
              )}
            </div>

            {/* Right Column: Project Files Explorer & Preview */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Detected Project Files ({report.files.length})</span>
              </h3>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                  {report.files.map((file) => (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => setSelectedFilePreview(file)}
                      className={`w-full flex items-center justify-between p-2 px-3 rounded-xl text-left text-xs font-mono transition-all ${
                        selectedFilePreview?.path === file.path
                          ? "bg-primary/10 border border-primary text-primary font-bold"
                          : "hover:bg-muted/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-sans font-bold bg-muted text-muted-foreground">
                        {file.type}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected File Content Preview */}
                {selectedFilePreview && (
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground font-mono">
                      <span>{selectedFilePreview.name}</span>
                      <span>{selectedFilePreview.lines.length} lines</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-background border font-mono text-[11px] text-foreground max-h-[300px] overflow-auto leading-relaxed">
                      {selectedFilePreview.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive SEO Educational Guide */}
      <ToolExplanation
        title="Deployment Config Doctor Guide"
        description="Deploying web applications to production involves configuring environment variables, Dockerfiles, Compose orchestration, Nginx reverse proxy directives, Next.js settings, and Kubernetes manifests. Deployment Config Doctor detects cross-file mismatches locally in your browser."
        howToUse={[
          "Drag & drop your project ZIP or select multiple configuration files (.env, Dockerfile, docker-compose.yml, nginx.conf, next.config.js, Kubernetes YAML, GitHub Actions).",
          "Files are automatically classified without manual selection.",
          "Inspect the Deployment Health Score (0-100) and filtered findings.",
          "Use the side-by-side code diff and recommended fixes to correct configuration errors.",
          "Export your full report in Markdown or JSON format.",
        ]}
        features={[
          "100% Client-Side Privacy: Processing runs locally in browser memory without server uploads.",
          "Cross-file relationship analyzer matching Nginx, Compose, Next.js, and Kubernetes.",
          "Secrets masking ensuring credentials like ADMIN_SECRET=•••••••••• are never exposed.",
          "Confidence scoring (High, Medium, Low) for precise error identification.",
          "Exportable Markdown and JSON audit report downloads.",
        ]}
        faqs={[
          {
            question: "What is a deployment configuration error?",
            answer:
              "A deployment configuration error occurs when settings across your .env files, Docker containers, Nginx reverse proxies, or Kubernetes manifests mismatch—such as a container listening on port 8080 while Nginx proxies to port 8081.",
          },
          {
            question: "How does Docker Compose networking differ from Kubernetes Services?",
            answer:
              "In Docker Compose, services communicate via container service names (e.g. http://backend:8080). In Kubernetes, Services use label selectors to route traffic to pod IPs. Using 'localhost' inside container networks will fail in both environments.",
          },
          {
            question: "Is Base64 encoding in Kubernetes Secrets secure?",
            answer:
              "No. Base64 encoding in Kubernetes Secret manifests is an encoding format, not encryption. Anyone with access to the YAML file can decode secrets instantly. Secrets should be encrypted at rest using KMS or Vault.",
          },
          {
            question: "Are my project files saved or uploaded anywhere?",
            answer:
              "No. All ZIP extraction, parsing, AST normalization, and rule evaluation run 100% locally in your browser. Nothing is uploaded or stored on TechWebCode servers.",
          },
        ]}
      />

      <RelatedTools currentSlug="deployment-config-doctor" />
    </div>
  );
}
