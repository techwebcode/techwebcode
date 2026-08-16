"use client";

import React, { useState, useEffect, useRef } from "react";
import YAML from "yaml";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ShieldCheck,
  Lock,
  Plus,
  Maximize2,
  Minimize2,
  FileText,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Unlock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  readonly tool: Tool;
}

interface SecretRow {
  id: string;
  key: string;
  value: string;
  isBase64: boolean;
  isVisible?: boolean;
  error?: string;
}

const SAMPLE_YAML = `version: "3.8"
services:
  web:
    image: techwebcode/web:latest
    ports:
      - "8080:8080"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://user:secret@db:3306/techwebcode
    restart: always
  db:
    image: mysql:8.4
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
`;

const SAMPLE_SECRET_ROWS: SecretRow[] = [
  {
    id: "1",
    key: "DB_PASSWORD",
    value: "super-secret-password-123",
    isBase64: false,
    isVisible: false,
  },
  {
    id: "2",
    key: "API_KEY",
    value: "sk_live_51Nx892389128391238912",
    isBase64: false,
    isVisible: false,
  },
];

const SAMPLE_DECODE_SECRET_YAML = `apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
  namespace: production
type: Opaque
data:
  DB_USER: cm9vdA==
  DB_PASSWORD: c3VwZXItc2VjcmV0LXBhc3N3b3JkLTEyMw==
  API_KEY: c2tfbGl2ZV81MU54ODkyMzg5MTI4MzkxMjM4OTEy
`;

const VALID_SECRET_TYPES = [
  "Opaque",
  "kubernetes.io/service-account-token",
  "kubernetes.io/dockercfg",
  "kubernetes.io/dockerconfigjson",
  "kubernetes.io/basic-auth",
  "kubernetes.io/ssh-auth",
  "kubernetes.io/tls",
  "bootstrap.kubernetes.io/token",
];

// Browser UTF-8 safe Base64 utilities
function utf8ToBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    return btoa(str);
  }
}

function base64ToUtf8(str: string): string {
  try {
    return decodeURIComponent(
      Array.from(atob(str))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(str);
  }
}

function isValidBase64(str: string): boolean {
  if (!str || str.trim() === "") return true;
  const cleaned = str.trim();
  if (cleaned.length % 4 !== 0) return false;
  const validRegex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!validRegex.test(cleaned)) return false;
  try {
    return btoa(atob(cleaned)) === cleaned;
  } catch {
    return false;
  }
}

export default function YamlFormatter({ tool }: Props) {
  const [activeTab, setActiveTab] = useState<"formatter" | "generator" | "decoder">("formatter");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Tab 1: YAML Formatter State
  const [yamlInput, setYamlInput] = useState(SAMPLE_YAML);
  const [yamlOutput, setYamlOutput] = useState("");
  const [yamlStatus, setYamlStatus] = useState<"idle" | "success" | "error">("idle");
  const [yamlErrorMessage, setYamlErrorMessage] = useState("");
  const [yamlErrorLine, setYamlErrorLine] = useState<number | null>(null);
  const [yamlErrorCol, setYamlErrorCol] = useState<number | null>(null);
  const [copiedYaml, setCopiedYaml] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Kubernetes Secret Generator State
  const [secretName, setSecretName] = useState("my-app-secret");
  const [secretNamespace, setSecretNamespace] = useState("default");
  const [secretType, setSecretType] = useState("Opaque");
  const [secretDataFormat, setSecretDataFormat] = useState<"data" | "stringData">("data");
  const [secretRows, setSecretRows] = useState<SecretRow[]>(SAMPLE_SECRET_ROWS);
  const [secretOutputYaml, setSecretOutputYaml] = useState("");
  const [secretValidationErrors, setSecretValidationErrors] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Tab 3: Kubernetes Secret Decoder State
  const [decoderInputYaml, setDecoderInputYaml] = useState(SAMPLE_DECODE_SECRET_YAML);
  const [decodedMetadata, setDecodedMetadata] = useState<{
    name?: string;
    namespace?: string;
    apiVersion?: string;
    kind?: string;
    type?: string;
  } | null>(null);
  const [decodedRows, setDecodedRows] = useState<SecretRow[]>([]);
  const [decoderErrors, setDecoderErrors] = useState<string[]>([]);
  const [copiedDecodedRows, setCopiedDecodedRows] = useState(false);

  // --- TAB 1: YAML FORMATTER LOGIC ---
  const handleFormatYaml = (text: string = yamlInput) => {
    if (!text.trim()) {
      setYamlOutput("");
      setYamlStatus("idle");
      setYamlErrorMessage("");
      setYamlErrorLine(null);
      setYamlErrorCol(null);
      return;
    }

    try {
      const parsed = YAML.parse(text);
      if (parsed === undefined) {
        setYamlOutput("");
        setYamlStatus("idle");
        setYamlErrorMessage("");
        setYamlErrorLine(null);
        setYamlErrorCol(null);
        return;
      }
      const formatted = YAML.stringify(parsed, { indent: 2 });
      setYamlOutput(formatted);
      setYamlStatus("success");
      setYamlErrorMessage("");
      setYamlErrorLine(null);
      setYamlErrorCol(null);
    } catch (err: any) {
      setYamlOutput("");
      setYamlStatus("error");
      const msg = err.message || "Invalid YAML syntax";
      setYamlErrorMessage(msg);

      if (err.linePos && err.linePos.length > 0) {
        setYamlErrorLine(err.linePos[0].line);
        setYamlErrorCol(err.linePos[0].col);
      } else {
        setYamlErrorLine(null);
        setYamlErrorCol(null);
      }
    }
  };

  const handleValidateYaml = () => {
    if (!yamlInput.trim()) {
      toast.error("Input is empty");
      return;
    }

    try {
      YAML.parse(yamlInput);
      setYamlStatus("success");
      setYamlErrorMessage("");
      setYamlErrorLine(null);
      setYamlErrorCol(null);
      toast.success("Valid YAML configuration!");
    } catch (err: any) {
      setYamlStatus("error");
      const msg = err.message || "Invalid YAML syntax";
      setYamlErrorMessage(msg);

      let lineInfo = "";
      if (err.linePos && err.linePos.length > 0) {
        setYamlErrorLine(err.linePos[0].line);
        setYamlErrorCol(err.linePos[0].col);
        lineInfo = ` at line ${err.linePos[0].line}, column ${err.linePos[0].col}`;
      }
      toast.error(`YAML Syntax Error${lineInfo}`);
    }
  };

  useEffect(() => {
    handleFormatYaml(yamlInput);
  }, [yamlInput]);

  const handleYamlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setYamlInput(content);
        toast.success(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadYaml = () => {
    if (!yamlOutput) return;
    const blob = new Blob([yamlOutput], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-config.yaml";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded formatted-config.yaml");
  };

  const handleCopyYaml = () => {
    if (!yamlOutput) return;
    navigator.clipboard.writeText(yamlOutput);
    setCopiedYaml(true);
    toast.success("Copied formatted YAML to clipboard!");
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleClearYaml = () => {
    setYamlInput("");
    setYamlOutput("");
    setYamlStatus("idle");
    setYamlErrorMessage("");
    setYamlErrorLine(null);
    setYamlErrorCol(null);
  };

  // --- TAB 2: KUBERNETES SECRET GENERATOR LOGIC ---
  const generateSecretYaml = () => {
    const errors: string[] = [];

    // Validation 1: Required metadata.name
    if (!secretName.trim()) {
      errors.push("Required field 'metadata.name' is missing.");
    } else if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(secretName.trim())) {
      errors.push("Secret name must be a valid DNS-1123 subdomain (lowercase letters, numbers, hyphens).");
    }

    // Validation 2: Secret Type check
    if (!secretType.trim()) {
      errors.push("Required field 'type' is missing.");
    } else if (!VALID_SECRET_TYPES.includes(secretType.trim()) && !secretType.trim().includes("/")) {
      errors.push(`Unusual Secret type '${secretType}'. Common types: ${VALID_SECRET_TYPES.join(", ")}`);
    }

    setSecretValidationErrors(errors);

    const dataObj: Record<string, string> = {};

    secretRows.forEach((row) => {
      const cleanKey = row.key.trim();
      if (!cleanKey) return;

      if (secretDataFormat === "data") {
        if (row.isBase64) {
          dataObj[cleanKey] = row.value.trim();
        } else {
          dataObj[cleanKey] = utf8ToBase64(row.value);
        }
      } else {
        if (row.isBase64) {
          try {
            dataObj[cleanKey] = base64ToUtf8(row.value.trim());
          } catch {
            dataObj[cleanKey] = row.value;
          }
        } else {
          dataObj[cleanKey] = row.value;
        }
      }
    });

    const manifestObj: any = {
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name: secretName.trim() || "my-secret",
      },
      type: secretType.trim() || "Opaque",
    };

    if (secretNamespace.trim()) {
      manifestObj.metadata.namespace = secretNamespace.trim();
    }

    if (secretDataFormat === "data") {
      manifestObj.data = dataObj;
    } else {
      manifestObj.stringData = dataObj;
    }

    const yamlStr = YAML.stringify(manifestObj, { indent: 2 });
    setSecretOutputYaml(yamlStr);
  };

  useEffect(() => {
    generateSecretYaml();
  }, [secretName, secretNamespace, secretType, secretDataFormat, secretRows]);

  const handleAddSecretRow = () => {
    const newRow: SecretRow = {
      id: Date.now().toString(),
      key: "",
      value: "",
      isBase64: false,
      isVisible: false,
    };
    setSecretRows((prev) => [...prev, newRow]);
  };

  const handleRemoveSecretRow = (id: string) => {
    setSecretRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateSecretRow = (id: string, field: keyof SecretRow, val: any) => {
    setSecretRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: val };

        if (field === "value" && updated.isBase64) {
          if (!isValidBase64(val)) {
            updated.error = "Invalid Base64 string";
          } else {
            updated.error = undefined;
          }
        }
        return updated;
      })
    );
  };

  const handleToggleRowVisibility = (id: string) => {
    setSecretRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r))
    );
  };

  const handleToggleRowBase64 = (id: string) => {
    setSecretRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (row.isBase64) {
          if (!isValidBase64(row.value)) {
            toast.error("Cannot decode: Invalid Base64 value");
            return row;
          }
          return {
            ...row,
            value: base64ToUtf8(row.value),
            isBase64: false,
            error: undefined,
          };
        } else {
          return {
            ...row,
            value: utf8ToBase64(row.value),
            isBase64: true,
            error: undefined,
          };
        }
      })
    );
  };

  const handleCopySecretYaml = () => {
    if (!secretOutputYaml) return;
    navigator.clipboard.writeText(secretOutputYaml);
    setCopiedSecret(true);
    toast.success("Copied Kubernetes Secret YAML!");
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleDownloadSecretYaml = () => {
    if (!secretOutputYaml) return;
    const blob = new Blob([secretOutputYaml], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${secretName.trim() || "secret"}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${secretName.trim() || "secret"}.yaml`);
  };

  const handleResetSecret = () => {
    setSecretName("my-app-secret");
    setSecretNamespace("default");
    setSecretType("Opaque");
    setSecretDataFormat("data");
    setSecretRows([
      { id: "1", key: "DB_PASSWORD", value: "super-secret-password-123", isBase64: false, isVisible: false },
    ]);
    toast.info("Secret generator reset");
  };

  // --- TAB 3: KUBERNETES SECRET DECODER LOGIC ---
  const handleDecodeSecretYaml = (input: string = decoderInputYaml) => {
    if (!input.trim()) {
      setDecodedMetadata(null);
      setDecodedRows([]);
      setDecoderErrors([]);
      return;
    }

    const errors: string[] = [];
    try {
      const parsed = YAML.parse(input);
      if (!parsed || typeof parsed !== "object") {
        setDecoderErrors(["Invalid YAML object payload."]);
        setDecodedMetadata(null);
        setDecodedRows([]);
        return;
      }

      // K8s Manifest Validation
      if (parsed.apiVersion !== "v1") {
        errors.push(`Expected 'apiVersion: v1', found '${parsed.apiVersion || "none"}'.`);
      }
      if (parsed.kind !== "Secret") {
        errors.push(`Expected 'kind: Secret', found '${parsed.kind || "none"}'.`);
      }
      if (!parsed.metadata?.name) {
        errors.push("Missing required field 'metadata.name'.");
      }

      setDecoderErrors(errors);

      setDecodedMetadata({
        name: parsed.metadata?.name,
        namespace: parsed.metadata?.namespace || "default",
        apiVersion: parsed.apiVersion,
        kind: parsed.kind,
        type: parsed.type || "Opaque",
      });

      const rows: SecretRow[] = [];
      const dataMap = parsed.data || {};
      const stringDataMap = parsed.stringData || {};

      // Process base64 data map
      Object.entries(dataMap).forEach(([k, v], idx) => {
        const valStr = String(v || "");
        let decodedVal = valStr;
        let isBase64Valid = true;

        if (isValidBase64(valStr)) {
          try {
            decodedVal = base64ToUtf8(valStr);
          } catch {
            isBase64Valid = false;
          }
        } else {
          isBase64Valid = false;
        }

        rows.push({
          id: `dec-data-${idx}`,
          key: k,
          value: decodedVal,
          isBase64: false,
          isVisible: false,
          error: isBase64Valid ? undefined : "Malformed Base64 value",
        });
      });

      // Process stringData map
      Object.entries(stringDataMap).forEach(([k, v], idx) => {
        rows.push({
          id: `dec-str-${idx}`,
          key: k,
          value: String(v || ""),
          isBase64: false,
          isVisible: false,
        });
      });

      setDecodedRows(rows);
      toast.success(`Successfully decoded ${rows.length} secret key(s)!`);
    } catch (err: any) {
      setDecoderErrors([err.message || "Failed to parse YAML manifest."]);
      setDecodedMetadata(null);
      setDecodedRows([]);
    }
  };

  useEffect(() => {
    handleDecodeSecretYaml(decoderInputYaml);
  }, [decoderInputYaml]);

  const handleCopyDecodedKeyValues = () => {
    if (decodedRows.length === 0) return;
    const formattedStr = decodedRows
      .map((r) => `${r.key}=${r.value}`)
      .join("\n");
    navigator.clipboard.writeText(formattedStr);
    setCopiedDecodedRows(true);
    toast.success("Copied decoded key-value pairs to clipboard!");
    setTimeout(() => setCopiedDecodedRows(false), 2000);
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : ""}`}>
      {/* Tool Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToolHeader tool={tool} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="h-9 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto shrink-0"
        >
          {isFullScreen ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span>Exit Full Screen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen Workspace</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Privacy Guarantee Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">100% Client-Side Privacy Notice</div>
          <div className="opacity-90 leading-relaxed">
            Your YAML configurations and Kubernetes Secret values are processed locally in your browser and are never uploaded, logged, or saved to TechWebCode servers.
          </div>
        </div>
      </div>

      {/* Tab Navigation: Formatter -> Generator -> Decoder */}
      <div className="border-b border-border">
        <nav className="flex flex-wrap gap-4" aria-label="Tool Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("formatter")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
              activeTab === "formatter"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>YAML Formatter & Validator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
              activeTab === "generator"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Kubernetes Secret Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("decoder")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
              activeTab === "decoder"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>Kubernetes Secret Decoder</span>
          </button>
        </nav>
      </div>

      {/* --- TAB 1: YAML FORMATTER --- */}
      {activeTab === "formatter" && (
        <div className="space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            accept=".yaml,.yml,text/plain"
            onChange={handleYamlFileUpload}
            className="hidden"
          />

          {/* Action Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => handleFormatYaml(yamlInput)}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format / Beautify</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleValidateYaml}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Validate Syntax</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setYamlInput(SAMPLE_YAML)}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <FileCode className="w-3.5 h-3.5 mr-1" />
                <span>Sample YAML</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                <span>Upload File</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!yamlOutput}
                onClick={handleCopyYaml}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedYaml ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                <span>{copiedYaml ? "Copied" : "Copy"}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!yamlOutput}
                onClick={handleDownloadYaml}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearYaml}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                title="Clear All"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Validation Status Banners */}
          {yamlStatus === "error" && yamlErrorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">YAML Syntax Error</div>
                <div className="opacity-90">{yamlErrorMessage}</div>
                {yamlErrorLine !== null && (
                  <div className="font-semibold text-rose-400 mt-1">
                    Line {yamlErrorLine}{yamlErrorCol !== null ? `, Column ${yamlErrorCol}` : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {yamlStatus === "success" && (
            <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valid YAML Syntax</span>
            </div>
          )}

          {/* Dual Code Editor Area */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                Raw YAML Input
              </span>
              <CodeEditor
                value={yamlInput}
                onChange={setYamlInput}
                language="yaml"
                placeholder="Paste or type unformatted YAML here..."
                height={isFullScreen ? "calc(100vh - 360px)" : "420px"}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                Formatted YAML Output
              </span>
              <CodeEditor
                value={yamlOutput}
                readOnly
                language="yaml"
                placeholder="Formatted YAML will appear here..."
                height={isFullScreen ? "calc(100vh - 360px)" : "420px"}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: KUBERNETES SECRET GENERATOR --- */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          {/* Prominent Base64 Security Warning Notice */}
          <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold text-foreground">Base64 Security Warning</div>
              <div className="opacity-90 leading-relaxed">
                Base64 encoding is <strong>not</strong> encryption. Kubernetes Secret values encoded with Base64 can be easily decoded by anyone with access to the manifest file using <code>echo &lt;value&gt; | base64 --decode</code>. Use SealedSecrets, Vault, or KMS for encrypted secrets.
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Secret Configuration Form & Rows */}
            <div className="lg:col-span-7 space-y-5 bg-card p-5 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-sm text-foreground">Secret Configuration</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetSecret}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>Reset Form</span>
                </Button>
              </div>

              {/* Metadata Fields: Name, Namespace, Secret Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="secretName" className="text-xs font-semibold">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="secretName"
                    value={secretName}
                    onChange={(e) => setSecretName(e.target.value)}
                    placeholder="my-app-secret"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="secretNamespace" className="text-xs font-semibold">
                    Namespace
                  </label>
                  <Input
                    id="secretNamespace"
                    value={secretNamespace}
                    onChange={(e) => setSecretNamespace(e.target.value)}
                    placeholder="default"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="secretType" className="text-xs font-semibold">
                    Secret Type
                  </label>
                  <Input
                    id="secretType"
                    value={secretType}
                    onChange={(e) => setSecretType(e.target.value)}
                    placeholder="Opaque"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Storage Format Toggle: stringData vs data */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold">Storage Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSecretDataFormat("stringData")}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      secretDataFormat === "stringData"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>○ stringData</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-normal">Plain Text</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1">
                      Plain text values; Kubernetes auto-encodes to Base64 on apply.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSecretDataFormat("data")}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      secretDataFormat === "data"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>○ data</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-normal">Base64 Encoded</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1">
                      Standard Kubernetes Secret manifest with Base64 values.
                    </div>
                  </button>
                </div>
              </div>

              {/* Secret Data Key/Value Rows Header */}
              <div className="flex items-center justify-between border-b pb-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Secret Data
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSecretRow}
                  className="h-7 px-2.5 text-xs font-semibold gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Key/Value</span>
                </Button>
              </div>

              {/* Dynamic Key/Value Rows with Eye Reveal/Hide Toggle */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {secretRows.map((row) => (
                  <div key={row.id} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={row.key}
                        onChange={(e) => handleUpdateSecretRow(row.id, "key", e.target.value)}
                        placeholder="KEY_NAME (e.g. DB_PASSWORD)"
                        className="h-8 text-xs font-mono font-bold flex-1"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRowBase64(row.id)}
                        className="h-8 px-2 text-[11px] font-mono gap-1 shrink-0"
                        title={row.isBase64 ? "Decode to Plain Text" : "Encode to Base64"}
                      >
                        <span>{row.isBase64 ? "Base64" : "Text"}</span>
                        <RefreshCw className="w-3 h-3" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSecretRow(row.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                        title="Remove Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Value Input with Eye Toggle */}
                    <div className="relative">
                      <Input
                        type={row.isVisible ? "text" : "password"}
                        value={row.value}
                        onChange={(e) => handleUpdateSecretRow(row.id, "value", e.target.value)}
                        placeholder={row.isBase64 ? "Base64 encoded string..." : "Plain-text value..."}
                        className="h-8 text-xs font-mono pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleRowVisibility(row.id)}
                        className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                        title={row.isVisible ? "Hide secret value" : "Reveal secret value"}
                      >
                        {row.isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {row.error && (
                      <div className="text-[11px] text-rose-500 font-medium">
                        {row.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Generate Action Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={generateSecretYaml}
                  className="w-full h-10 font-bold gap-2 text-xs uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Manifest</span>
                </Button>
              </div>
            </div>

            {/* Right Column: Kubernetes Secret Manifest Output */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  Kubernetes Secret Manifest
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecretYaml}
                    className="h-7 px-2.5 text-xs font-semibold gap-1"
                  >
                    {copiedSecret ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSecret ? "Copied" : "Copy"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadSecretYaml}
                    className="h-7 px-2.5 text-xs font-semibold gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>

              {/* Kubernetes Validation Notices */}
              {secretValidationErrors.length > 0 && (
                <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-500 text-xs space-y-1 font-mono">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Manifest Validation Warnings:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 opacity-90 text-[11px]">
                    {secretValidationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <CodeEditor
                value={secretOutputYaml}
                readOnly
                language="yaml"
                placeholder="Kubernetes Secret manifest will be generated here..."
                height={isFullScreen ? "calc(100vh - 360px)" : "480px"}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: KUBERNETES SECRET DECODER --- */}
      {activeTab === "decoder" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Existing Kubernetes Secret YAML Manifest Input */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  Existing Kubernetes Secret YAML Manifest
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDecoderInputYaml(SAMPLE_DECODE_SECRET_YAML)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <FileCode className="w-3.5 h-3.5 mr-1" />
                  <span>Sample Secret YAML</span>
                </Button>
              </div>

              <CodeEditor
                value={decoderInputYaml}
                onChange={setDecoderInputYaml}
                language="yaml"
                placeholder="Paste existing Kubernetes Secret YAML manifest here..."
                height={isFullScreen ? "calc(100vh - 360px)" : "480px"}
              />
            </div>

            {/* Right Column: Decoded Key-Values Table */}
            <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-foreground">Decoded Secret Values</h3>
                  {decodedMetadata && (
                    <div className="text-xs font-mono text-muted-foreground">
                      {decodedMetadata.name} ({decodedMetadata.namespace}) • {decodedMetadata.type}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={decodedRows.length === 0}
                  onClick={handleCopyDecodedKeyValues}
                  className="h-7 px-2.5 text-xs font-semibold gap-1"
                >
                  {copiedDecodedRows ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedDecodedRows ? "Copied" : "Copy Key-Values"}</span>
                </Button>
              </div>

              {/* Manifest Validation Errors */}
              {decoderErrors.length > 0 && (
                <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 text-xs space-y-1 font-mono">
                  <div className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Decoder Validation Errors:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 opacity-90 text-[11px]">
                    {decoderErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decoded Key-Value Pairs List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {decodedRows.length > 0 ? (
                  decodedRows.map((row) => (
                    <div key={row.id} className="p-3 rounded-xl border border-border bg-muted/20 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-primary">
                        <span>{row.key}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setDecodedRows((prev) =>
                              prev.map((r) => (r.id === row.id ? { ...r, isVisible: !r.isVisible } : r))
                            )
                          }
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px] font-sans font-normal"
                        >
                          {row.isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{row.isVisible ? "Hide" : "Reveal"}</span>
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-background border font-mono text-xs break-all">
                        {row.isVisible ? (
                          <span className="text-emerald-500 font-semibold">{row.value}</span>
                        ) : (
                          <span className="text-muted-foreground tracking-widest font-bold">••••••••••••••••</span>
                        )}
                      </div>

                      {row.error && (
                        <div className="text-[11px] text-rose-500 font-medium font-mono">
                          ⚠️ {row.error}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground italic border rounded-xl bg-muted/10">
                    Paste a valid Kubernetes Secret YAML manifest to decode Base64 values.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Educational Section */}
      <ToolExplanation
        title="YAML Formatter & Kubernetes Secret Tool Guide"
        description="Master YAML syntax formatting, structure validation, and Kubernetes Secret Base64 encoding/decoding. This browser tool helps DevOps engineers, system administrators, and web developers prepare error-free deployment manifests."
        howToUse={[
          "Use Tab 1 (YAML Formatter & Validator) to clean up indentations, check key-value syntax, and format YAML documents or Docker Compose files.",
          "Use Tab 2 (Kubernetes Secret Generator) to generate valid Kubernetes Secret manifests using either Base64 encoded 'data' or plain-text 'stringData' fields.",
          "Use Tab 3 (Kubernetes Secret Decoder) to paste existing Kubernetes Secret manifests and decode Base64 'data' values into human-readable plain text.",
          "Toggle Reveal/Hide to inspect sensitive secret keys and values securely in your browser.",
          "Click Copy or Download to save your formatted manifest to your local machine.",
        ]}
        features={[
          "100% Client-Side Privacy: Processing runs in local browser memory with zero server uploads.",
          "Monaco Code Editor integration with full syntax highlighting.",
          "Supports both data (Base64) and stringData (Plain-text) Kubernetes Secret formats.",
          "Kubernetes Manifest Validation checking apiVersion, kind, metadata.name, and valid secret types.",
          "Kubernetes Secret Decoder with Reveal/Hide value toggles.",
          "Full-screen workspace toggle for large manifest editing.",
        ]}
        faqs={[
          {
            question: "What is YAML?",
            answer:
              "YAML (YAML Ain't Markup Language) is a human-friendly data serialization format used extensively for DevOps configuration files, Docker Compose, Kubernetes manifests, and GitHub Actions pipelines.",
          },
          {
            question: "What is a Kubernetes Secret?",
            answer:
              "A Kubernetes Secret is an object that lets you store and manage sensitive information, such as passwords, OAuth tokens, and SSH keys, separately from your container image definitions.",
          },
          {
            question: "What is the difference between data and stringData in Kubernetes Secrets?",
            answer:
              "The 'data' field requires values to be Base64-encoded strings. The 'stringData' field allows you to specify plain-text strings directly in the YAML manifest; Kubernetes automatically encodes them to Base64 when the secret is created or updated.",
          },
          {
            question: "Is Base64 encoding considered encryption?",
            answer:
              "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string back to plain text without a key using 'echo <value> | base64 --decode'. In production Kubernetes clusters, secrets should be encrypted at rest using KMS or HashiCorp Vault.",
          },
          {
            question: "Is my secret data safe using this tool?",
            answer:
              "Yes! All processing, Base64 conversion, YAML formatting, and decoding happen 100% locally in your browser's JavaScript runtime. Nothing is transmitted across the internet.",
          },
        ]}
      />

      <RelatedTools currentSlug="yaml-formatter" />
    </div>
  );
}
