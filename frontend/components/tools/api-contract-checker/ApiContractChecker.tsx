"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Trash2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
  Maximize2,
  Minimize2,
  Search,
  CheckSquare,
  Network,
  GitBranch,
  Download,
  ArrowUpRight,
  Info,
  Sliders,
  Check,
  FileCode,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  CompatibilityReport,
  ApiContractFinding,
  OpenApiReport,
  SchemaComparisonReport,
  SchemaCompatibilityMode,
} from "./types";
import { compareApiResponses } from "./comparatorEngine";
import { parseAndAnalyzeOpenApi, resolveLocalRef } from "./openApiAnalyzer";
import { validateResponseAgainstOpenApiSchema } from "./openApiResponseValidator";
import { compareJsonSchemas } from "./jsonSchemaComparator";
import { findJsonPathLineNumber } from "./jsonPathLocator";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface Props {
  readonly tool: Tool;
}

const SAMPLE_PREVIOUS_API_RESPONSE = `{
  "status": "success",
  "code": 200,
  "user": {
    "id": 10482,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "admin",
    "is_active": true
  }
}`;

const SAMPLE_CURRENT_API_RESPONSE = `{
  "status": "success",
  "code": 200,
  "user": {
    "id": "10482",
    "username": "johndoe",
    "role": "admin",
    "is_active": true,
    "avatar_url": "https://cdn.example.com/avatar.png"
  }
}`;

const SAMPLE_OPENAPI_SPEC_YAML = `openapi: 3.0.3
info:
  title: TechWebCode User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User details object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      required:
        - id
        - username
      properties:
        id:
          type: integer
        username:
          type: string
        email:
          type: string
`;

const SAMPLE_PREV_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "email": { "type": "string" },
    "age": { "type": "integer", "minimum": 18 }
  }
}`;

const SAMPLE_CURR_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email", "phone"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string" },
    "phone": { "type": "string" },
    "age": { "type": "integer", "minimum": 21 }
  }
}`;

const SAMPLE_JSON_DATA_PAYLOAD = `{
  "id": 101,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 25
}`;

export default function ApiContractChecker({ tool }: Props) {
  const [activeTab, setActiveTab] = useState<"comparator" | "openapi" | "schema" | "validator">("comparator");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Tab 1: Response-to-Response Comparator State
  const [previousJson, setPreviousJson] = useState(SAMPLE_PREVIOUS_API_RESPONSE);
  const [currentJson, setCurrentJson] = useState(SAMPLE_CURRENT_API_RESPONSE);
  const [report, setReport] = useState<CompatibilityReport | null>(null);

  // Filters & Controls for Tab 1
  const [filterSeverity, setFilterSeverity] = useState<"all" | "breaking" | "potential" | "compatible">("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [showOnlyStructural, setShowOnlyStructural] = useState(false);

  // Monaco Editor Instance Refs for Line Jumping
  const prevEditorRef = useRef<any>(null);
  const currEditorRef = useRef<any>(null);

  // Tab 2: OpenAPI Contract Checker State
  const [openApiSpecInput, setOpenApiSpecInput] = useState(SAMPLE_OPENAPI_SPEC_YAML);
  const [openApiReport, setOpenApiReport] = useState<OpenApiReport | null>(null);

  // Tab 3: JSON Schema Validator & Comparator State
  const [schemaSubTab, setSchemaSubTab] = useState<"validate" | "compare">("compare");
  const [schemaDataInput, setSchemaDataInput] = useState(SAMPLE_JSON_DATA_PAYLOAD);
  const [schemaDocInput, setSchemaDocInput] = useState(SAMPLE_PREV_JSON_SCHEMA);
  const [prevSchemaInput, setPrevSchemaInput] = useState(SAMPLE_PREV_JSON_SCHEMA);
  const [currSchemaInput, setCurrSchemaInput] = useState(SAMPLE_CURR_JSON_SCHEMA);
  const [schemaMode, setSchemaMode] = useState<SchemaCompatibilityMode>("response");
  const [schemaCompReport, setSchemaCompReport] = useState<SchemaComparisonReport | null>(null);

  // Tab 4: Contract vs Response Validator Integration State
  const [valSelectedEndpoint, setValSelectedEndpoint] = useState("/users/{id}");
  const [valSelectedMethod, setValSelectedMethod] = useState("GET");
  const [valSelectedStatus, setValSelectedStatus] = useState("200");
  const [valActualResponseJson, setValActualResponseJson] = useState(SAMPLE_CURRENT_API_RESPONSE);
  const [valReport, setValReport] = useState<any | null>(null);

  // --- TAB 1 COMPARISON ENGINE EXECUTION ---
  useEffect(() => {
    const res = compareApiResponses(previousJson, currentJson);
    setReport(res);
  }, [previousJson, currentJson]);

  // --- TAB 2 OPENAPI ANALYZER EXECUTION ---
  useEffect(() => {
    const res = parseAndAnalyzeOpenApi(openApiSpecInput);
    setOpenApiReport(res);
  }, [openApiSpecInput]);

  // --- TAB 3 SCHEMA COMPARATOR EXECUTION ---
  useEffect(() => {
    const res = compareJsonSchemas(prevSchemaInput, currSchemaInput, schemaMode);
    setSchemaCompReport(res);
  }, [prevSchemaInput, currSchemaInput, schemaMode]);

  // --- TAB 4 CONTRACT RESPONSE VALIDATOR EXECUTION ---
  const handleValidateContractResponse = () => {
    if (!openApiReport || !openApiReport.rawSpec) {
      toast.error("Valid OpenAPI specification required in Tab 2 first.");
      return;
    }

    const pathObj = openApiReport.rawSpec.paths?.[valSelectedEndpoint];
    const opObj = pathObj?.[valSelectedMethod.toLowerCase()];
    const respObj = opObj?.responses?.[valSelectedStatus];

    const targetSchema =
      respObj?.content?.["application/json"]?.schema || respObj?.schema;

    const res = validateResponseAgainstOpenApiSchema(
      valActualResponseJson,
      targetSchema,
      openApiReport.rawSpec
    );
    setValReport(res);
  };

  // --- TAB 4 CONTRACT SUMMARY COMPUTATION ---
  const selectedSchemaSummary = useMemo(() => {
    if (!openApiReport || !openApiReport.rawSpec) return null;

    const rawDoc = openApiReport.rawSpec;
    const pathObj = rawDoc.paths?.[valSelectedEndpoint];
    if (!pathObj) return null;

    const opObj = pathObj[valSelectedMethod.toLowerCase()];
    if (!opObj) return null;

    const respObj = opObj.responses?.[valSelectedStatus];
    if (!respObj) return null;

    let schema = respObj.content?.["application/json"]?.schema || respObj.schema;
    if (!schema) return null;

    if (schema.$ref && typeof schema.$ref === "string") {
      const { resolved } = resolveLocalRef(rawDoc, schema.$ref);
      if (resolved) schema = resolved;
    }

    const rootType = schema.type || (schema.properties ? "object" : "unknown");
    const requiredFields: string[] = Array.isArray(schema.required) ? schema.required : [];
    const properties: Record<string, string> = {};

    if (schema.properties) {
      Object.entries(schema.properties).forEach(([k, v]: [string, any]) => {
        let pType = v?.type || "any";
        if (v?.$ref && typeof v.$ref === "string") {
          const parts = v.$ref.split("/");
          pType = `$ref (${parts[parts.length - 1]})`;
        }
        properties[k] = pType;
      });
    }

    return {
      rootType,
      requiredFields,
      properties,
      description: respObj.description || opObj.summary || "Expected JSON response payload",
    };
  }, [openApiReport, valSelectedEndpoint, valSelectedMethod, valSelectedStatus]);

  // --- FILTERED FINDINGS FOR TAB 1 REPORT ---
  const filteredFindings = useMemo(() => {
    if (!report || !report.findings) return [];
    return report.findings.filter((f) => {
      // Severity Filter
      if (filterSeverity !== "all" && f.severity !== filterSeverity) return false;
      // Structural Filter
      if (showOnlyStructural && !f.isStructural) return false;
      // Text Search Filter
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim();
        const matchPath = f.path.toLowerCase().includes(q);
        const matchTitle = f.title.toLowerCase().includes(q);
        const matchExp = f.explanation.toLowerCase().includes(q);
        if (!matchPath && !matchTitle && !matchExp) return false;
      }
      return true;
    });
  }, [report, filterSeverity, showOnlyStructural, filterSearch]);

  // --- CLICK-TO-JUMP MONACO LINE HIGHLIGHT ---
  const handleJumpToFinding = (f: ApiContractFinding) => {
    const linePrev = f.lineNumberPrev || findJsonPathLineNumber(previousJson, f.path);
    const lineCurr = f.lineNumberCurr || findJsonPathLineNumber(currentJson, f.path);

    let jumped = false;

    if ((f.targetSide === "previous" || f.targetSide === "both") && linePrev && prevEditorRef.current) {
      prevEditorRef.current.revealLineInCenter(linePrev);
      prevEditorRef.current.setSelection({
        startLineNumber: linePrev,
        startColumn: 1,
        endLineNumber: linePrev,
        endColumn: 200,
      });
      prevEditorRef.current.focus();
      jumped = true;
    }

    if ((f.targetSide === "current" || f.targetSide === "both") && lineCurr && currEditorRef.current) {
      currEditorRef.current.revealLineInCenter(lineCurr);
      currEditorRef.current.setSelection({
        startLineNumber: lineCurr,
        startColumn: 1,
        endLineNumber: lineCurr,
        endColumn: 200,
      });
      if (f.targetSide === "current") currEditorRef.current.focus();
      jumped = true;
    }

    if (jumped) {
      toast.success(`Jumped to target field ${f.path} in JSON editor`);
    } else {
      toast.info(`Target path ${f.path} highlighted in payload`);
    }
  };

  // --- COPY REPORT TO CLIPBOARD ---
  const handleCopyReport = () => {
    if (!report) return;

    let markdown = `# API Compatibility Report\n\n`;
    markdown += `**Overall Status:** ${report.overallStatus.toUpperCase()}\n`;
    markdown += `**Summary:** ${report.breakingCount} Breaking · ${report.potentialCount} Potential · ${report.compatibleCount} Compatible\n\n`;
    markdown += `> ${report.clientImpactSummary}\n\n`;
    markdown += `### Detailed Findings (${report.findings.length})\n\n`;
    markdown += `| JSONPath | Change Type | Severity | Baseline (Prev) | Candidate (Curr) | Description |\n`;
    markdown += `|---|---|---|---|---|---|\n`;

    report.findings.forEach((f) => {
      const prevVal = f.previousValue !== undefined ? `${f.previousType} (${f.previousValue})` : f.previousType || "-";
      const currVal = f.currentValue !== undefined ? `${f.currentType} (${f.currentValue})` : f.currentType || "-";
      markdown += `| \`${f.path}\` | ${f.changeType} | **${f.severity.toUpperCase()}** | ${prevVal} | ${currVal} | ${f.explanation} |\n`;
    });

    navigator.clipboard.writeText(markdown);
    toast.success("Markdown compatibility report copied to clipboard!");
  };

  // --- EXPORT REPORT TO FILE ---
  const handleExportReport = (format: "json" | "md") => {
    if (!report) return;

    let content = "";
    let filename = "";
    let mimeType = "";

    if (format === "json") {
      content = JSON.stringify(report, null, 2);
      filename = "api-compatibility-report.json";
      mimeType = "application/json";
    } else {
      content = `# API Compatibility Report\n\nGenerated by TechWebCode API Contract Checker\n\nOverall Status: ${report.overallStatus.toUpperCase()}\nBreakdown: ${report.breakingCount} Breaking, ${report.potentialCount} Potential, ${report.compatibleCount} Compatible\n\n${report.clientImpactSummary}\n\n## Findings\n\n` +
        report.findings
          .map(
            (f) =>
              `### ${f.path} [${f.severity.toUpperCase()}]\n- **Type:** ${f.changeType}\n- **Previous:** ${f.previousType} (${f.previousValue})\n- **Current:** ${f.currentType} (${f.currentValue})\n- **Explanation:** ${f.explanation}\n- **Recommendation:** ${f.recommendation || "N/A"}\n`
          )
          .join("\n");
      filename = "api-compatibility-report.md";
      mimeType = "text/markdown";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filename}`);
  };

  if (isFullScreen) {
    return (
      <FullScreenWorkspace
        isOpen={true}
        onClose={() => setIsFullScreen(false)}
        title={tool.name}
        badge="IDE Workspace Mode"
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-4 w-full h-full">
          {/* Viewport Workspace Tabs Navigation Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("comparator")}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "comparator"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>1. Response-to-Response</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("openapi")}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "openapi"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Network className="w-4 h-4" />
              <span>2. OpenAPI / Swagger</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schema")}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "schema"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>3. JSON Schema</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("validator")}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "validator"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>4. Contract ↔ Response</span>
            </button>
          </div>

          {/* Active Workspace View Container */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
            {activeTab === "comparator" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-100">API Response Baseline vs Candidate Payload</div>
                    <div className="text-xs text-slate-400">Compare baseline production JSON (v1) against candidate release JSON (v2).</div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => { setPreviousJson(SAMPLE_PREVIOUS_API_RESPONSE); setCurrentJson(SAMPLE_CURRENT_API_RESPONSE); }} className="h-8 text-xs gap-1.5 border-slate-700 text-slate-200 hover:bg-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Load Sample Payloads</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CodeEditor value={previousJson} onChange={setPreviousJson} title="Baseline v1 API Response Payload (JSON)" language="json" placeholder="Paste baseline API response JSON..." height="420px" onEditorMount={(ed) => { prevEditorRef.current = ed; }} />
                  <CodeEditor value={currentJson} onChange={setCurrentJson} title="Candidate v2 API Response Payload (JSON)" language="json" placeholder="Paste candidate API response JSON..." height="420px" onEditorMount={(ed) => { currEditorRef.current = ed; }} />
                </div>
              </div>
            )}

            {activeTab === "openapi" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="font-bold text-sm text-slate-100">OpenAPI 3.0 / 3.1 & Swagger 2.0 Spec Analyzer</div>
                  <CodeEditor value={openApiSpecInput} onChange={setOpenApiSpecInput} language="yaml" placeholder="Paste OpenAPI YAML or JSON spec here..." height="400px" />
                </div>
              </div>
            )}

            {activeTab === "schema" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="font-bold text-sm text-slate-100">JSON Schema Structural Comparator</div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CodeEditor value={prevSchemaInput} onChange={setPrevSchemaInput} language="json" placeholder="Paste baseline JSON schema..." height="400px" />
                    <CodeEditor value={currSchemaInput} onChange={setCurrSchemaInput} language="json" placeholder="Paste target JSON schema..." height="400px" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "validator" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="font-bold text-sm text-slate-100">Check Your API Response Against Its Contract</div>
                  <CodeEditor value={valActualResponseJson} onChange={setValActualResponseJson} language="json" placeholder="Paste actual JSON response payload..." height="380px" />
                  <Button type="button" onClick={handleValidateContractResponse} className="w-full h-10 font-bold gap-2 text-xs uppercase tracking-wider bg-blue-600 text-white">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validate Response Against Contract</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FullScreenWorkspace>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header & Controls in Normal Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToolHeader tool={tool} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsFullScreen(true)}
          className="h-9 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Full Screen Workspace</span>
        </Button>
      </div>

      {/* Strict Privacy Guarantee Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm shadow-2xs">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-foreground">100% Client-Side Privacy Guarantee</div>
          <div className="opacity-90 leading-relaxed text-slate-600 dark:text-slate-400">
            🔒 Your API contracts and JSON responses are analyzed locally in browser JS memory. Zero payload logs sent to servers.
          </div>
        </div>
      </div>

      {/* Workspace Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex flex-wrap gap-4" aria-label="Tool Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("comparator")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-bold transition-all ${
              activeTab === "comparator"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>1. Response-to-Response Comparator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("openapi")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-bold transition-all ${
              activeTab === "openapi"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network className="w-4 h-4" />
            <span>2. OpenAPI / Swagger Checker</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-bold transition-all ${
              activeTab === "schema"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>3. JSON Schema Validator & Comparator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("validator")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-bold transition-all ${
              activeTab === "validator"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>4. Contract ↔ Response Validator</span>
          </button>
        </nav>
      </div>

      {/* --- TAB 1: RESPONSE-TO-RESPONSE COMPARATOR --- */}
      {activeTab === "comparator" && (
        <div className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-3 rounded-2xl border">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Sample Payloads:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreviousJson(SAMPLE_PREVIOUS_API_RESPONSE);
                  setCurrentJson(SAMPLE_CURRENT_API_RESPONSE);
                  toast.success("Loaded sample with breaking field type change & added property");
                }}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
              >
                🔴 Breaking Change Sample (id: int ➔ string)
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreviousJson(SAMPLE_PREVIOUS_API_RESPONSE);
                  setCurrentJson(JSON.stringify({
                    status: "success",
                    code: 200,
                    user: {
                      id: 10482,
                      username: "johndoe",
                      email: "john.doe@example.com",
                      role: "admin",
                      is_active: true,
                      avatar_url: "https://cdn.example.com/avatar.png",
                      last_login: "2026-08-23T00:00:00Z"
                    }
                  }, null, 2));
                  toast.success("Loaded compatible sample with optional new fields");
                }}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
              >
                🟢 Backward Compatible Sample (New optional properties)
              </button>

              <button
                type="button"
                onClick={() => {
                  setPreviousJson("");
                  setCurrentJson("");
                  toast.info("Cleared response editors");
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Previous Response (Baseline)
                </span>
                {!report?.isPreviousValid && report?.parseErrorPrevious && (
                  <span className="text-[11px] font-bold text-rose-500">
                    ⚠ {report.parseErrorPrevious}
                  </span>
                )}
              </div>
              <CodeEditor
                value={previousJson}
                onChange={setPreviousJson}
                language="json"
                placeholder="Paste previous API response JSON payload here..."
                height={isFullScreen ? "calc(100vh - 460px)" : "360px"}
                onEditorMount={(ed) => {
                  prevEditorRef.current = ed;
                }}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Current Response (Candidate)
                </span>
                {!report?.isCurrentValid && report?.parseErrorCurrent && (
                  <span className="text-[11px] font-bold text-rose-500">
                    ⚠ {report.parseErrorCurrent}
                  </span>
                )}
              </div>
              <CodeEditor
                value={currentJson}
                onChange={setCurrentJson}
                language="json"
                placeholder="Paste current API response JSON payload here..."
                height={isFullScreen ? "calc(100vh - 460px)" : "360px"}
                onEditorMount={(ed) => {
                  currEditorRef.current = ed;
                }}
              />
            </div>
          </div>

          {/* COMPATIBILITY REPORT DASHBOARD */}
          {report && (
            <div className="p-6 rounded-2xl bg-card border space-y-5 shadow-sm">
              {/* PROMINENT SUMMARY BANNER */}
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  report.overallStatus === "breaking"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    : report.overallStatus === "potential"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {report.overallStatus === "breaking"
                        ? "🔴"
                        : report.overallStatus === "potential"
                        ? "🟡"
                        : "🟢"}
                    </span>
                    <h3 className="text-lg font-black tracking-tight text-foreground">
                      {report.overallStatus === "breaking"
                        ? "BREAKING CHANGES DETECTED"
                        : report.overallStatus === "potential"
                        ? "POTENTIAL COMPATIBILITY ISSUES DETECTED"
                        : "BACKWARD COMPATIBLE API CHANGE"}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                    {report.clientImpactSummary}
                  </p>
                </div>

                {/* Counter Badges */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    <span className="text-rose-500 font-black">{report.breakingCount}</span>
                    <span>Breaking</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    <span className="text-amber-500 font-black">{report.potentialCount}</span>
                    <span>Potential</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    <span className="text-emerald-500 font-black">{report.compatibleCount}</span>
                    <span>Compatible</span>
                  </div>
                </div>
              </div>

              {/* REPORT CONTROLS: SEVERITY FILTERS, SEARCH, COPY & EXPORT */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1 border-b pb-4">
                {/* Severity Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setFilterSeverity("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      filterSeverity === "all"
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Findings ({report.findings.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterSeverity("breaking")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      filterSeverity === "breaking"
                        ? "bg-rose-600 text-white shadow"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    }`}
                  >
                    🔴 Breaking ({report.breakingCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterSeverity("potential")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      filterSeverity === "potential"
                        ? "bg-amber-600 text-white shadow"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                    }`}
                  >
                    🟡 Potential ({report.potentialCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterSeverity("compatible")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      filterSeverity === "compatible"
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    🟢 Compatible ({report.compatibleCount})
                  </button>
                </div>

                {/* Filter Search & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder="Filter path/finding..."
                      className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border bg-background font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOnlyStructural(!showOnlyStructural)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      showOnlyStructural
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-background text-muted-foreground hover:text-foreground border-border"
                    }`}
                    title="Toggle structural schema changes vs value updates"
                  >
                    Schema Only
                  </button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReport}
                    className="h-8 px-2.5 text-xs font-semibold gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Report</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport("md")}
                    className="h-8 px-2.5 text-xs font-semibold gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MD</span>
                  </Button>
                </div>
              </div>

              {/* DETAILED FINDINGS CARDS */}
              {filteredFindings.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                  No findings match current filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFindings.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => handleJumpToFinding(f)}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                        f.severity === "breaking"
                          ? "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/30"
                          : f.severity === "potential"
                          ? "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30"
                          : "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                            {f.path}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                            {f.changeType.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                              f.severity === "breaking"
                                ? "bg-rose-600 text-white"
                                : f.severity === "potential"
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {f.severity}
                          </span>

                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 flex items-center gap-0.5">
                            Jump to Line <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Values & Types Comparison Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 text-xs font-mono bg-background/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                            Baseline Type & Value:
                          </span>
                          <span className="text-slate-900 dark:text-slate-100 font-semibold">
                            {f.previousType || "undefined"}
                            {f.previousValue !== undefined && (
                              <span className="text-slate-500 dark:text-slate-400 font-normal">
                                {" "}
                                ({f.previousValue})
                              </span>
                            )}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                            Candidate Type & Value:
                          </span>
                          <span className="text-slate-900 dark:text-slate-100 font-semibold">
                            {f.currentType || "undefined"}
                            {f.currentValue !== undefined && (
                              <span className="text-slate-500 dark:text-slate-400 font-normal">
                                {" "}
                                ({f.currentValue})
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Title & Explanation */}
                      <div className="space-y-1 mt-2">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>{f.title}</span>
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {f.explanation}
                        </p>
                        {f.recommendation && (
                          <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 pt-1">
                            💡 <strong>Recommendation:</strong> {f.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: OPENAPI / SWAGGER CHECKER --- */}
      {activeTab === "openapi" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 flex flex-col space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                OpenAPI 3.0 / 3.1 or Swagger 2.0 Specification (YAML / JSON)
              </span>
              <CodeEditor
                value={openApiSpecInput}
                onChange={setOpenApiSpecInput}
                language="yaml"
                placeholder="Paste OpenAPI YAML or JSON specification..."
                height={isFullScreen ? "calc(100vh - 360px)" : "480px"}
              />
            </div>

            <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
              <div className="border-b pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">OpenAPI Contract Dashboard</h3>
                  {openApiReport?.stats && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/30 font-mono">
                      OpenAPI {openApiReport.stats.version}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {openApiReport?.title}
                </div>
              </div>

              {/* Stats Cards */}
              {openApiReport?.stats && (
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-muted/30 border">
                    <div className="font-extrabold text-lg text-foreground">
                      {openApiReport.stats.totalEndpoints}
                    </div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold">
                      Endpoints
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/30 border">
                    <div className="font-extrabold text-lg text-foreground">
                      {openApiReport.stats.totalSchemas}
                    </div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold">
                      Schemas
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/30 border">
                    <div className="font-extrabold text-lg text-foreground">
                      {openApiReport.stats.totalSecuritySchemes}
                    </div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold">
                      Security Schemes
                    </div>
                  </div>
                </div>
              )}

              {/* Discovered Operations List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Discovered Operations & Endpoints
                </span>

                {openApiReport?.endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border bg-muted/20 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          ep.method === "GET"
                            ? "bg-sky-500 text-white"
                            : ep.method === "POST"
                            ? "bg-emerald-500 text-white"
                            : ep.method === "PUT"
                            ? "bg-amber-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-foreground">{ep.path}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-sans truncate max-w-[140px]">
                      {ep.summary || "No description"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: JSON SCHEMA VALIDATOR & COMPARATOR --- */}
      {activeTab === "schema" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSchemaSubTab("compare")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  schemaSubTab === "compare"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Schema-to-Schema Comparator
              </button>

              <button
                type="button"
                onClick={() => setSchemaSubTab("validate")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  schemaSubTab === "validate"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Data Payload vs JSON Schema Validator
              </button>
            </div>

            {schemaSubTab === "compare" && (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-muted-foreground">Compatibility Mode:</span>
                <button
                  type="button"
                  onClick={() => setSchemaMode("response")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    schemaMode === "response"
                      ? "bg-emerald-500 text-white shadow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  ○ API Response Mode
                </button>

                <button
                  type="button"
                  onClick={() => setSchemaMode("request")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    schemaMode === "request"
                      ? "bg-purple-500 text-white shadow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  ○ API Request Mode
                </button>
              </div>
            )}
          </div>

          {schemaSubTab === "compare" && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                    Previous JSON Schema
                  </span>
                  <CodeEditor
                    value={prevSchemaInput}
                    onChange={setPrevSchemaInput}
                    language="json"
                    placeholder="Paste previous JSON Schema document..."
                    height={isFullScreen ? "calc(100vh - 420px)" : "360px"}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                    Current JSON Schema
                  </span>
                  <CodeEditor
                    value={currSchemaInput}
                    onChange={setCurrSchemaInput}
                    language="json"
                    placeholder="Paste current JSON Schema document..."
                    height={isFullScreen ? "calc(100vh - 420px)" : "360px"}
                  />
                </div>
              </div>

              {/* Schema Comparison Report */}
              {schemaCompReport && (
                <div className="p-5 rounded-2xl bg-card border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="font-bold text-sm text-foreground">
                      Schema Compatibility Report ({schemaMode.toUpperCase()} Mode)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-rose-500">🔴 {schemaCompReport.breakingCount} Breaking</span>
                      <span className="text-emerald-500">🟢 {schemaCompReport.compatibleCount} Compatible</span>
                    </div>
                  </div>

                  {/* Migration Guidance */}
                  {schemaCompReport.migrationSteps.length > 0 && (
                    <div className="p-4 rounded-xl bg-muted/20 border text-xs space-y-1">
                      <div className="font-bold text-foreground">Actionable Migration Plan:</div>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {schemaCompReport.migrationSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Findings */}
                  <div className="space-y-3">
                    {schemaCompReport.findings.map((f) => (
                      <div key={f.id} className="p-4 rounded-xl border bg-muted/10 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-primary">{f.path}</span>
                          <span className="font-extrabold uppercase text-[10px]">{f.severity}</span>
                        </div>
                        <div className="font-bold text-foreground">{f.title}</div>
                        <div className="text-muted-foreground">{f.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {schemaSubTab === "validate" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                  JSON Data Payload
                </span>
                <CodeEditor
                  value={schemaDataInput}
                  onChange={setSchemaDataInput}
                  language="json"
                  placeholder="Paste JSON data instance..."
                  height="360px"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                  JSON Schema Specification
                </span>
                <CodeEditor
                  value={schemaDocInput}
                  onChange={setSchemaDocInput}
                  language="json"
                  placeholder="Paste target JSON Schema..."
                  height="360px"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: CONTRACT VS RESPONSE VALIDATOR --- */}
      {activeTab === "validator" && (
        <div className="space-y-6">
          {/* Header Card with Core Concept & 4-Step Guide */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Live API Response Validation</span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight mt-1">
                  Check Your API Response Against Its Contract
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
                  The <strong>API Contract</strong> (OpenAPI spec loaded in Tab 2) defines the <em>expected blueprint</em> promised to clients. The <strong>Actual Response</strong> is the live JSON returned by your server. This tool verifies whether your live server output conforms to your contract specifications.
                </p>
              </div>
            </div>

            {/* 4-Step "How It Works" Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <div className="font-extrabold text-foreground flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">1</span>
                  <span>Select Endpoint</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Choose a route from your OpenAPI spec or enter custom route details.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <div className="font-extrabold text-foreground flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">2</span>
                  <span>Inspect Contract</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Review expected root type, required properties, and schema fields.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <div className="font-extrabold text-foreground flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">3</span>
                  <span>Paste Live JSON</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Paste actual response payload JSON returned by your live API server.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <div className="font-extrabold text-foreground flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">4</span>
                  <span>Validate Output</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Run validation to detect breaking schema violations or missing required fields.
                </p>
              </div>
            </div>

            {/* Discovered Endpoints Selector & Manual Route Inputs */}
            <div className="space-y-3 pt-2">
              {openApiReport?.endpoints && openApiReport.endpoints.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    <span>Quick Select Discovered Endpoint from Tab 2 Spec:</span>
                  </label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const [m, ...pParts] = val.split(" ");
                      const p = pParts.join(" ");
                      setValSelectedMethod(m);
                      setValSelectedEndpoint(p);
                    }}
                    value={`${valSelectedMethod} ${valSelectedEndpoint}`}
                    className="w-full h-9 px-3 text-xs font-mono rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {openApiReport.endpoints.map((ep, idx) => (
                      <option key={idx} value={`${ep.method} ${ep.path}`}>
                        {ep.method} {ep.path} {ep.summary ? `— ${ep.summary}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Endpoint Path</label>
                  <Input
                    value={valSelectedEndpoint}
                    onChange={(e) => setValSelectedEndpoint(e.target.value)}
                    placeholder="/users/{id}"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">HTTP Method</label>
                  <Input
                    value={valSelectedMethod}
                    onChange={(e) => setValSelectedMethod(e.target.value.toUpperCase())}
                    placeholder="GET"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Response Status Code</label>
                  <Input
                    value={valSelectedStatus}
                    onChange={(e) => setValSelectedStatus(e.target.value)}
                    placeholder="200"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Compact Contract Summary Card */}
            {selectedSchemaSummary ? (
              <div className="p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 dark:border-blue-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-blue-700 dark:text-blue-300">
                      {valSelectedMethod} {valSelectedEndpoint} ({valSelectedStatus} Response Contract)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Root: {selectedSchemaSummary.rootType}
                    </span>
                  </div>

                  <span className="text-[11px] text-muted-foreground font-medium">
                    {selectedSchemaSummary.description}
                  </span>
                </div>

                {/* Required Fields */}
                {selectedSchemaSummary.requiredFields.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Required Fields:</span>
                    {selectedSchemaSummary.requiredFields.map((reqF) => (
                      <span
                        key={reqF}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-extrabold font-mono"
                      >
                        ✓ {reqF}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expected Schema Properties */}
                {Object.keys(selectedSchemaSummary.properties).length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Expected Response Schema Properties:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {Object.entries(selectedSchemaSummary.properties).map(([pName, pType]) => {
                        const isReq = selectedSchemaSummary.requiredFields.includes(pName);
                        return (
                          <span
                            key={pName}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                              isReq
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold"
                                : "bg-background border-border text-foreground font-medium"
                            }`}
                          >
                            {pName}: <span className="text-muted-foreground font-normal">{pType}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  Using OpenAPI contract loaded in Tab 2. To test against custom specifications, update your OpenAPI YAML/JSON in Tab 2.
                </span>
              </div>
            )}
          </div>

          {/* Actual Response Editor Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Actual API Response Payload (Live Server JSON Output)</span>
              </span>
            </div>
            <CodeEditor
              value={valActualResponseJson}
              onChange={setValActualResponseJson}
              language="json"
              placeholder="Paste actual JSON response payload returned by live server..."
              height="280px"
            />
          </div>

          {/* Action Button */}
          <Button
            type="button"
            onClick={handleValidateContractResponse}
            className="w-full h-11 font-black gap-2 text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>Validate Live Response Against Contract</span>
          </Button>

          {/* Validation Result Dashboard */}
          {valReport && (
            <div className="p-5 rounded-2xl border bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="font-extrabold text-sm flex items-center gap-2">
                  <span>Contract Validation Result:</span>
                  {valReport.isValid ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black">
                      🟢 100% Contract Compliant
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-black">
                      🔴 Contract Violations ({valReport.errorCount})
                    </span>
                  )}
                </div>
              </div>

              {valReport.isValid ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Actual Live Response Strictly Matches OpenAPI Contract Schema</span>
                  </div>
                  <p className="opacity-90">
                    All required fields are present, data types match contract definitions, and no breaking schema violations were detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {valReport.findings.map((f: any) => (
                    <div key={f.id} className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-xs space-y-1.5">
                      <div className="font-bold font-mono text-rose-600 dark:text-rose-400 flex items-center justify-between">
                        <span>{f.title} ({f.path})</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                          Violation
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {f.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SEO Educational Guide Section */}
      <ToolExplanation
        title="API Contract & Response Compatibility Checker Guide"
        description="Verify backward compatibility between API response payloads, validate OpenAPI 3.0 / 3.1 & Swagger specs, and compare JSON Schemas before deploying backend releases. Detect breaking field removals, primitive data type mismatches, and nullability changes locally in your browser."
        howToUse={[
          "Use Tab 1 (Response-to-Response Comparator) to compare baseline v1 vs candidate v2 JSON response payloads.",
          "Use Tab 2 (OpenAPI / Swagger Checker) to parse and validate OpenAPI YAML or JSON specs, inspect endpoints, and resolve local $ref pointers.",
          "Use Tab 3 (JSON Schema Validator & Comparator) to compare JSON Schemas under API Request or API Response compatibility modes.",
          "Use Tab 4 (Contract ↔ Response Validator) to test actual JSON API response instances against your OpenAPI response schema.",
        ]}
        features={[
          "100% Client-Side Privacy: Processing runs locally in browser memory without server uploads.",
          "OpenAPI 3.0, 3.1, and Swagger 2.0 validation engine with $ref resolution.",
          "JSON Schema Draft-07 and Draft 2020-12 data validator and schema comparator.",
          "Request vs Response compatibility modes with structured tree diffs and migration guidance.",
          "JSONPath notation ($.user.id, $.users[0].avatar) for precise property target identification.",
        ]}
        faqs={[
          {
            question: "What makes an API response change breaking?",
            answer:
              "A breaking change occurs when an existing client expecting a specific payload fails to parse or process the response. Examples include removing a response field (e.g. $.user.email), changing a primitive type (number -> string), or swapping an object for an array.",
          },
          {
            question: "Why do Request and Response compatibility modes use different rules?",
            answer:
              "In API Request Mode, adding a new required field is breaking because existing client requests will be rejected by the server. In API Response Mode, removing a response property is breaking because existing client deserializers expecting the field will fail.",
          },
          {
            question: "Are my API contracts or responses uploaded anywhere?",
            answer:
              "No. All JSON parsing, OpenAPI spec analysis, JSON Schema validation, and structural diffing run 100% locally in your browser. Nothing touches TechWebCode servers.",
          },
        ]}
      />

      <RelatedTools currentSlug="api-contract-checker" />
    </div>
  );
}
