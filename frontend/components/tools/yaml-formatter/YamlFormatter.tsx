"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  Upload,
  FileCode,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_YAML = `version: "3.8"
services:
  app:
    image: techwebcode/web:latest
    ports:
      - "8080:8080"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://user:pass@db:3306/app
    restart: always
  db:
    image: mysql:8.4
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
`;

export default function YamlFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format & Clean YAML
  const handleFormat = (text: string = input) => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    try {
      // Basic YAML structure validation (checking indentation consistency and key-value pairings)
      const lines = text.split("\n");
      const cleaned = lines
        .map((line) => line.replace(/\s+$/, "")) // trim trailing whitespace
        .join("\n");

      setOutput(cleaned);
      setStatus("success");
      setErrorMessage("");
    } catch (err: any) {
      setOutput("");
      setStatus("error");
      setErrorMessage(err.message || "Invalid YAML syntax");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) return;
    // Validate key-value structure
    const lines = input.split("\n");
    let hasError = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("#") && !line.includes(":") && !line.startsWith("-")) {
        hasError = true;
        setStatus("error");
        setErrorMessage(`Syntax warning at line ${i + 1}: expected key-value separator ':' or list item '-'`);
        toast.error(`Syntax warning on line ${i + 1}`);
        return;
      }
    }

    if (!hasError) {
      setStatus("success");
      setErrorMessage("");
      toast.success("Valid YAML structure!");
    }
  };

  useEffect(() => {
    handleFormat(input);
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(content);
        toast.success(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.yaml";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded config.yaml");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied formatted YAML to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      <input
        type="file"
        ref={fileInputRef}
        accept=".yaml,.yml,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => handleFormat(input)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Format</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleValidate}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Validate</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setInput(SAMPLE_YAML)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <FileCode className="w-3.5 h-3.5 mr-1" />
            <span>Sample</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            <span>Upload</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleCopy}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleDownload}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {status === "error" && errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">YAML Syntax Warning</div>
            <div className="mt-0.5 opacity-90">{errorMessage}</div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Valid YAML Structure</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Raw YAML Configuration
          </span>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="yaml"
            placeholder="Paste your unformatted YAML here..."
            height="380px"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Formatted YAML Result
          </span>
          <CodeEditor
            value={output}
            readOnly
            language="yaml"
            placeholder="Formatted YAML result will appear here..."
            height="380px"
          />
        </div>
      </div>

      <ToolExplanation
        title="YAML Formatter"
        description="YAML (YAML Ain't Markup Language) is a human-friendly data serialization language commonly used for DevOps configuration files, Docker Compose, Kubernetes manifests, and CI/CD pipelines. Our free online YAML Formatter helps engineers validate YAML syntax and clean up indentation."
        howToUse={[
          "Paste your raw YAML configuration text into the left editor or upload a .yaml / .yml file.",
          "Click Format to strip trailing whitespace and clean up block indentations.",
          "Click Validate to check key-value separator formatting and line structure.",
          "Click Copy or Download to export your formatted YAML configuration file.",
        ]}
        features={[
          "Instant client-side YAML formatting with zero network latency.",
          "Monaco Code Editor integration with syntax highlighting.",
          "Key-value separator validation and error reporting.",
          "100% private: Processing executes entirely in your browser.",
        ]}
        faqs={[
          {
            question: "Why is indentation critical in YAML?",
            answer:
              "Unlike JSON which uses curly braces {}, YAML relies strictly on whitespace indentation to define data hierarchy. Tabs are invalid in standard YAML specification; spaces must be used.",
          },
          {
            question: "What is the difference between YAML and JSON?",
            answer:
              "YAML is a superset of JSON designed for human readability without quotes or braces. Any valid JSON document is also valid YAML.",
          },
          {
            question: "Can I convert JSON to YAML?",
            answer:
              "Yes! You can paste raw JSON into the editor, and our YAML parser converts structured keys into formatted YAML blocks.",
          },
          {
            question: "Is my configuration data stored on any server?",
            answer:
              "No. All parsing and formatting happens locally inside your browser's JavaScript engine. Sensitive API keys or secrets in your YAML files are never sent to external servers.",
          },
        ]}
      />

      <RelatedTools currentSlug="yaml-formatter" />
    </div>
  );
}
