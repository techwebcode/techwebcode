"use client";

import React, { useState, useEffect } from "react";
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
  FileCode,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  ArrowRightLeft,
  Maximize2,
  Minimize2,
  Search,
  Activity,
  Layers,
  FileText,
  KeyRound,
  CheckSquare,
  Network,
  GitBranch,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  CompatibilityReport,
  ApiContractFinding,
  OpenApiReport,
  SchemaComparisonReport,
  SchemaCompatibilityMode,
  SchemaTreeNode,
} from "./types";
import { compareApiResponses } from "./comparatorEngine";
import { parseAndAnalyzeOpenApi } from "./openApiAnalyzer";
import { validateResponseAgainstOpenApiSchema } from "./openApiResponseValidator";
import { validateDataAgainstJsonSchema } from "./jsonSchemaValidator";
import { compareJsonSchemas } from "./jsonSchemaComparator";

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

  // Tab 2: OpenAPI Contract Checker State
  const [openApiSpecInput, setOpenApiSpecInput] = useState(SAMPLE_OPENAPI_SPEC_YAML);
  const [openApiReport, setOpenApiReport] = useState<OpenApiReport | null>(null);
  const [openApiSearch, setOpenApiSearch] = useState("");

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

  // --- TAB 1 LOGIC ---
  const handleCompare = () => {
    const res = compareApiResponses(previousJson, currentJson);
    setReport(res);
  };

  useEffect(() => {
    handleCompare();
  }, [previousJson, currentJson]);

  // --- TAB 2 LOGIC ---
  const handleAnalyzeOpenApi = () => {
    const res = parseAndAnalyzeOpenApi(openApiSpecInput);
    setOpenApiReport(res);
  };

  useEffect(() => {
    handleAnalyzeOpenApi();
  }, [openApiSpecInput]);

  // --- TAB 3 LOGIC ---
  const handleCompareSchemas = () => {
    const res = compareJsonSchemas(prevSchemaInput, currSchemaInput, schemaMode);
    setSchemaCompReport(res);
  };

  useEffect(() => {
    handleCompareSchemas();
  }, [prevSchemaInput, currSchemaInput, schemaMode]);

  // --- TAB 4 LOGIC ---
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

  return (
    <div className={`space-y-6 ${isFullScreen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : ""}`}>
      {/* Header & Controls */}
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

      {/* Strict Privacy Guarantee Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">100% Client-Side Privacy Guarantee</div>
          <div className="opacity-90 leading-relaxed">
            🔒 Your API contracts and JSON responses are analyzed locally in your browser. Nothing is uploaded to TechWebCode. Sensitive specs and payloads remain strictly on your device.
          </div>
        </div>
      </div>

      {/* Workspace Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex flex-wrap gap-4" aria-label="Tool Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("comparator")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
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
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
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
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
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
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-all ${
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
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Previous Response (Baseline)
              </span>
              <CodeEditor
                value={previousJson}
                onChange={setPreviousJson}
                language="json"
                placeholder="Paste previous API response JSON payload here..."
                height={isFullScreen ? "calc(100vh - 420px)" : "360px"}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Current Response (Candidate)
              </span>
              <CodeEditor
                value={currentJson}
                onChange={setCurrentJson}
                language="json"
                placeholder="Paste current API response JSON payload here..."
                height={isFullScreen ? "calc(100vh - 420px)" : "360px"}
              />
            </div>
          </div>

          {report && (
            <div className="p-5 rounded-2xl bg-card border space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>Compatibility Report:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                      report.overallStatus === "breaking"
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                        : report.overallStatus === "potential"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                    }`}
                  >
                    {report.overallStatus === "breaking"
                      ? "🔴 Breaking Changes Detected"
                      : report.overallStatus === "potential"
                      ? "🟠 Potentially Breaking"
                      : "🟢 Backward Compatible"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-rose-500">🔴 {report.breakingCount} Breaking</span>
                  <span className="text-amber-500">🟠 {report.potentialCount} Potential</span>
                  <span className="text-emerald-500">🟢 {report.compatibleCount} Compatible</span>
                </div>
              </div>

              <div className="space-y-3">
                {report.findings.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl border bg-muted/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{f.path}</span>
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

      {/* --- TAB 2: OPENAPI / SWAGGER CHECKER --- */}
      {activeTab === "openapi" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 flex flex-col space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
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

              {/* Endpoints List */}
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
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                      <span className="font-semibold text-foreground">{ep.path}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-sans">
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
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
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
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
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
                      <div className="font-bold text-foreground">Recommended Migration Action Plan:</div>
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
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
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
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
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
        <div className="space-y-6 bg-card p-5 rounded-2xl border border-border shadow-sm">
          <div className="border-b pb-3 space-y-1">
            <h3 className="font-bold text-sm text-foreground">
              Validate Actual Response Against Discovered OpenAPI Contract
            </h3>
            <p className="text-xs text-muted-foreground">
              Select an endpoint discovered from your OpenAPI specification in Tab 2 and validate an actual JSON API response payload.
            </p>
          </div>

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

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Actual Response Payload JSON
            </span>
            <CodeEditor
              value={valActualResponseJson}
              onChange={setValActualResponseJson}
              language="json"
              placeholder="Paste actual JSON response payload..."
              height="260px"
            />
          </div>

          <Button
            type="button"
            onClick={handleValidateContractResponse}
            className="w-full h-10 font-bold gap-2 text-xs uppercase tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate Response Against Contract</span>
          </Button>

          {valReport && (
            <div className="p-4 rounded-xl border bg-muted/20 space-y-3 font-mono text-xs">
              <div className="font-bold flex items-center gap-2">
                <span>Validation Result:</span>
                {valReport.isValid ? (
                  <span className="text-emerald-500 font-bold">🟢 100% Schema Valid</span>
                ) : (
                  <span className="text-rose-500 font-bold">🔴 Contract Violations ({valReport.errorCount})</span>
                )}
              </div>

              {valReport.findings.map((f: any) => (
                <div key={f.id} className="p-3 rounded-lg border bg-rose-500/10 text-rose-500 space-y-1">
                  <div className="font-bold">{f.title} ({f.path})</div>
                  <div>{f.explanation}</div>
                </div>
              ))}
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
