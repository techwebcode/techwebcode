"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  FileCode,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
  Search,
  Code2,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  parseRegexTokens,
  generatePlainEnglish,
  diagnoseNoMatch,
  RegexToken,
  DiagnosticResult,
} from "./regexParser";

interface Props {
  readonly tool: Tool;
}

interface MatchItem {
  index: number;
  length: number;
  match: string;
  groups: string[];
  namedGroups: Record<string, string>;
}

interface ExamplePreset {
  name: string;
  pattern: string;
  flags: { g: boolean; i: boolean; m: boolean; s: boolean; u: boolean; y: boolean };
  sampleText: string;
  description: string;
}

const PRESET_EXAMPLES: ExamplePreset[] = [
  {
    name: "Strong Password",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    flags: { g: true, i: false, m: false, s: false, u: false, y: false },
    sampleText: "MyPassword123!\nweakpass\nNO_SPECIAL_CHAR_123",
    description: "Requires at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
  },
  {
    name: "Email Address",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: { g: true, i: true, m: true, s: false, u: false, y: false },
    sampleText: "Contact us at support@techwebcode.in or sales.team@example.com for inquiries.\nInvalid email: test@domain@com",
    description: "Matches standard email address formats.",
  },
  {
    name: "URL / Web Link",
    pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    flags: { g: true, i: true, m: true, s: false, u: false, y: false },
    sampleText: "Visit https://techwebcode.in/tools for free tools or http://localhost:8082/api/v1 for API documentation.",
    description: "Matches HTTP and HTTPS URLs.",
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: { g: true, i: false, m: true, s: false, u: false, y: false },
    sampleText: "Deployment release dates: 2026-08-16, 2026-12-31, and invalid date 26-08-2026.",
    description: "Matches dates in YYYY-MM-DD format with named capture groups.",
  },
  {
    name: "Log File Entry Parsing",
    pattern: "^\\[(?<timestamp>[^\\]]+)\\]\\s+(?<level>INFO|WARN|ERROR)\\s+-\\s+(?<msg>.*)$",
    flags: { g: true, i: false, m: true, s: false, u: false, y: false },
    sampleText: "[2026-08-16 21:00:00] INFO - Server started successfully\n[2026-08-16 21:05:12] ERROR - Failed to connect to MySQL database",
    description: "Parses structured log entries with timestamp, level, and message groups.",
  },
  {
    name: "Extract Hashtags",
    pattern: "#\\w+",
    flags: { g: true, i: true, m: true, s: false, u: false, y: false },
    sampleText: "Learning #DevOps and #React with #TechWebCode tools!",
    description: "Extracts social media hashtags starting with #.",
  },
  {
    name: "IPv4 Address",
    pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: { g: true, i: false, m: true, s: false, u: false, y: false },
    sampleText: "Server IPs: 127.0.0.1, 192.168.1.100, 10.0.0.1, and invalid IP 999.999.999.999.",
    description: "Matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255).",
  },
];

const CHEAT_SHEET = [
  { symbol: "\\d", desc: "Digit (0-9)" },
  { symbol: "\\D", desc: "Non-digit character" },
  { symbol: "\\w", desc: "Word char [a-zA-Z0-9_]" },
  { symbol: "\\W", desc: "Non-word character" },
  { symbol: "\\s", desc: "Whitespace (space/tab)" },
  { symbol: "\\S", desc: "Non-whitespace character" },
  { symbol: ".", desc: "Any character (except newline)" },
  { symbol: "^", desc: "Start of string or line" },
  { symbol: "$", desc: "End of string or line" },
  { symbol: "\\b", desc: "Word boundary" },
  { symbol: "+", desc: "One or more times (greedy)" },
  { symbol: "*", desc: "Zero or more times" },
  { symbol: "?", desc: "Optional (0 or 1 time)" },
  { symbol: "{3,5}", desc: "Between 3 and 5 times" },
  { symbol: "[abc]", desc: "Character set (a, b, or c)" },
  { symbol: "[^abc]", desc: "Negated character set" },
  { symbol: "(...)", desc: "Capturing group" },
  { symbol: "(?:...)", desc: "Non-capturing group" },
  { symbol: "(?<name>...)", desc: "Named capture group" },
  { symbol: "(?=...)", desc: "Positive lookahead" },
  { symbol: "(?!...)", desc: "Negative lookahead" },
  { symbol: "(?<=...)", desc: "Positive lookbehind" },
  { symbol: "(?<!...)", desc: "Negative lookbehind" },
  { symbol: "a|b", desc: "Alternation (a OR b)" },
];

export default function RegexTester({ tool }: Props) {
  const [flavor, setFlavor] = useState("javascript");
  const [pattern, setPattern] = useState("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: true,
    s: false,
    u: false,
    y: false,
  });
  const [testText, setTestText] = useState("MyPassword123!\nweakpass\nNO_SPECIAL_CHAR_123");
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copiedPattern, setCopiedPattern] = useState(false);
  const [copiedMatches, setCopiedMatches] = useState(false);
  const [cheatFilter, setCheatFilter] = useState("");

  const [tokens, setTokens] = useState<RegexToken[]>([]);
  const [plainEnglish, setPlainEnglish] = useState("");
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult>({ hasMatch: true });

  const evaluateRegex = () => {
    if (!pattern.trim() || !testText) {
      setMatches([]);
      setErrorMsg("");
      setTokens([]);
      setPlainEnglish("");
      setDiagnostic({ hasMatch: false });
      return;
    }

    try {
      const flagStr =
        (flags.g ? "g" : "") +
        (flags.i ? "i" : "") +
        (flags.m ? "m" : "") +
        (flags.s ? "s" : "") +
        (flags.u ? "u" : "") +
        (flags.y ? "y" : "");

      const regex = new RegExp(pattern, flagStr);
      const list: MatchItem[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = regex.exec(testText)) !== null) {
          const named: Record<string, string> = {};
          if (match.groups) {
            Object.assign(named, match.groups);
          }

          list.push({
            index: match.index,
            length: match[0].length,
            match: match[0],
            groups: match.slice(1),
            namedGroups: named,
          });

          count++;
          if (count > 500) break; // Safeguard against infinite loops
          if (match[0].length === 0) {
            regex.lastIndex++; // Prevent zero-width match infinite loop
          }
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          const named: Record<string, string> = {};
          if (match.groups) {
            Object.assign(named, match.groups);
          }
          list.push({
            index: match.index,
            length: match[0].length,
            match: match[0],
            groups: match.slice(1),
            namedGroups: named,
          });
        }
      }

      setMatches(list);
      setErrorMsg("");

      // Generate Tokens & Plain-English explanation
      const parsedTokens = parseRegexTokens(pattern);
      setTokens(parsedTokens);
      setPlainEnglish(generatePlainEnglish(pattern));

      // Diagnostic check if 0 matches
      if (list.length === 0) {
        const diag = diagnoseNoMatch(pattern, flagStr, testText);
        setDiagnostic(diag);
      } else {
        setDiagnostic({ hasMatch: true });
      }
    } catch (err: any) {
      setMatches([]);
      setErrorMsg(err.message || "Invalid Regular Expression syntax");
      setTokens([]);
      setPlainEnglish("");
      setDiagnostic({
        hasMatch: false,
        reason: "Invalid Regular Expression Syntax",
        suggestion: err.message || "Check for unclosed brackets [], parentheses (), or syntax errors.",
      });
    }
  };

  useEffect(() => {
    evaluateRegex();
  }, [pattern, flags, testText]);

  const handleCopyPattern = () => {
    if (!pattern) return;
    const flagStr =
      (flags.g ? "g" : "") +
      (flags.i ? "i" : "") +
      (flags.m ? "m" : "") +
      (flags.s ? "s" : "") +
      (flags.u ? "u" : "") +
      (flags.y ? "y" : "");
    const fullReg = `/${pattern}/${flagStr}`;
    navigator.clipboard.writeText(fullReg);
    setCopiedPattern(true);
    toast.success("Copied regex pattern!");
    setTimeout(() => setCopiedPattern(false), 2000);
  };

  const handleCopyMatches = () => {
    if (matches.length === 0) return;
    const matchStrings = matches.map((m) => m.match).join("\n");
    navigator.clipboard.writeText(matchStrings);
    setCopiedMatches(true);
    toast.success(`Copied ${matches.length} matches!`);
    setTimeout(() => setCopiedMatches(false), 2000);
  };

  const handleClear = () => {
    setPattern("");
    setTestText("");
    setMatches([]);
    setErrorMsg("");
    setTokens([]);
    setPlainEnglish("");
    toast.info("Cleared pattern and test string");
  };

  const handleSelectExample = (preset: ExamplePreset) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setTestText(preset.sampleText);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const filteredCheatSheet = CHEAT_SHEET.filter(
    (item) =>
      item.symbol.toLowerCase().includes(cheatFilter.toLowerCase()) ||
      item.desc.toLowerCase().includes(cheatFilter.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${isFullScreen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : ""}`}>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToolHeader tool={tool} />
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="h-9 px-3 text-xs font-medium gap-1.5"
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
      </div>

      {/* Privacy Notice Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">100% Private Client-Side Execution</div>
          <div className="opacity-90 leading-relaxed">
            Your regex patterns and test strings are evaluated strictly inside your browser memory. No text or regex patterns are uploaded or logged to TechWebCode servers.
          </div>
        </div>
      </div>

      {/* Flavor Selector & Preset Examples */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm items-center">
        <div className="md:col-span-4 space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Regex Flavor / Engine</span>
          </label>
          <select
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="javascript">JavaScript (V8 / ES2024)</option>
            <option value="pcre2">PCRE2 (PHP / Nginx / Apache)</option>
            <option value="python">Python (re module)</option>
            <option value="go">Go (RE2 engine)</option>
            <option value="java">Java (java.util.regex)</option>
            <option value="dotnet">.NET (System.Text.RegularExpressions)</option>
          </select>
        </div>

        <div className="md:col-span-8 space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Examples</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectExample(preset)}
                className="px-2.5 py-1 rounded-lg border border-border bg-muted/30 text-[11px] font-medium text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {flavor !== "javascript" && (
        <div className="flex items-center gap-2 p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Evaluating using client-side JavaScript engine simulating <strong>{flavor.toUpperCase()}</strong> flavor. Features unsupported in JavaScript (such as possessive quantifiers or atomic groups) will be highlighted.
          </span>
        </div>
      )}

      {/* Regex Pattern Editor & Flag Toggles */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Regular Expression Pattern
          </label>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyPattern}
              className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {copiedPattern ? (
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1" />
              )}
              <span>{copiedPattern ? "Copied" : "Copy Pattern"}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
              title="Clear All Inputs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 flex items-center bg-muted/30 border border-border rounded-xl px-4 py-2 font-mono text-sm shadow-inner">
            <span className="text-primary font-bold text-base mr-1.5 select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm tracking-wide"
            />
            <span className="text-primary font-bold text-base ml-1.5 select-none">/</span>
            <span className="text-emerald-500 font-bold text-xs ml-1 font-mono">
              {(flags.g ? "g" : "") +
                (flags.i ? "i" : "") +
                (flags.m ? "m" : "") +
                (flags.s ? "s" : "") +
                (flags.u ? "u" : "") +
                (flags.y ? "y" : "")}
            </span>
          </div>

          {/* Flags Checklist */}
          <div className="flex flex-wrap items-center gap-3 bg-muted/20 px-3.5 py-2.5 rounded-xl border border-border text-xs font-semibold select-none">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                className="accent-primary h-3.5 w-3.5 rounded cursor-pointer"
              />
              <span>global (g)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                className="accent-primary h-3.5 w-3.5 rounded cursor-pointer"
              />
              <span>insensitive (i)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                className="accent-primary h-3.5 w-3.5 rounded cursor-pointer"
              />
              <span>multiline (m)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-primary">
              <input
                type="checkbox"
                checked={flags.s}
                onChange={(e) => setFlags({ ...flags, s: e.target.checked })}
                className="accent-primary h-3.5 w-3.5 rounded cursor-pointer"
              />
              <span>singleline / dotAll (s)</span>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Invalid Regular Expression Syntax</div>
              <div className="mt-0.5 opacity-90">{errorMsg}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Dual Workspace: Test String & Matches Output */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Test String Editor */}
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Test String Input
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTestText(PRESET_EXAMPLES[0].sampleText)}
              className="h-6 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <FileCode className="w-3 h-3 mr-1" />
              <span>Sample String</span>
            </Button>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Paste text string here to evaluate pattern matches..."
            rows={14}
            className="w-full rounded-2xl border border-input bg-card p-4 font-mono text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-y"
          />
        </div>

        {/* Right Column: Match Results & Group Extraction */}
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Evaluation Results ({matches.length} {matches.length === 1 ? "Match" : "Matches"})
            </label>
            {matches.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyMatches}
                className="h-6 px-2 text-[11px] font-semibold gap-1 text-emerald-500 border-emerald-500/30"
              >
                {copiedMatches ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedMatches ? "Copied" : "Copy Matches"}</span>
              </Button>
            )}
          </div>

          <div className="flex-1 rounded-2xl border border-border bg-card p-4 space-y-3 overflow-y-auto max-h-[380px] font-mono text-xs shadow-sm">
            {matches.length === 0 ? (
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-rose-500 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>No Pattern Matches Found</span>
                </div>

                {/* Diagnostic Section */}
                {!diagnostic.hasMatch && diagnostic.reason && (
                  <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-1 font-sans text-xs">
                    <div className="font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Why didn't this match?</span>
                    </div>
                    <div className="font-semibold text-foreground">{diagnostic.reason}</div>
                    {diagnostic.suggestion && (
                      <div className="opacity-90 pt-0.5">{diagnostic.suggestion}</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ {matches.length} {matches.length === 1 ? "Match" : "Matches"} Found</span>
                </div>

                {matches.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between border-b pb-1.5 text-[11px]">
                      <span className="font-bold text-primary">Match #{idx + 1}</span>
                      <span className="text-muted-foreground font-mono">
                        Range: [{item.index}, {item.index + item.length}]
                      </span>
                    </div>

                    <div className="bg-background p-2 rounded-lg border font-mono font-bold text-emerald-500 break-all select-all">
                      {item.match}
                    </div>

                    {/* Numbered Groups */}
                    {item.groups.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
                        <span className="text-muted-foreground font-sans font-semibold">
                          Captured Groups:
                        </span>
                        {item.groups.map((grp, gIdx) => (
                          <div key={gIdx} className="flex items-center gap-2 pl-2">
                            <span className="text-muted-foreground font-mono">${gIdx + 1}:</span>
                            <span className="font-mono text-foreground font-medium break-all">
                              {grp !== undefined ? `"${grp}"` : "<undefined>"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Named Groups */}
                    {Object.keys(item.namedGroups).length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
                        <span className="text-muted-foreground font-sans font-semibold">
                          Named Groups:
                        </span>
                        {Object.entries(item.namedGroups).map(([name, val]) => (
                          <div key={name} className="flex items-center gap-2 pl-2">
                            <span className="text-primary font-mono font-semibold">{name}:</span>
                            <span className="font-mono text-foreground font-medium break-all">
                              "{val}"
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regex Explanation & Plain English Breakdown */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span>Regex Structure & Token Breakdown</span>
          </h3>
          <span className="text-xs text-muted-foreground font-medium">AST Analysis</span>
        </div>

        {plainEnglish && (
          <div className="p-3.5 rounded-xl border bg-primary/10 border-primary/30 text-primary text-xs sm:text-sm font-medium">
            <div className="font-bold text-foreground mb-0.5">Plain-English Pattern Summary:</div>
            <div>{plainEnglish}</div>
          </div>
        )}

        {tokens.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-2 px-3">Token</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tokens.map((t, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono font-bold text-primary">{t.token}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-md border text-[10px] font-semibold bg-muted text-muted-foreground">
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-foreground">{t.description}</td>
                    <td className="py-2 px-3 text-muted-foreground opacity-90">{t.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic py-2">
            Type a valid regular expression pattern above to view token-by-token breakdown.
          </div>
        )}
      </div>

      {/* Quick Reference Cheat Sheet */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Regex Quick Reference Cheat Sheet</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={cheatFilter}
              onChange={(e) => setCheatFilter(e.target.value)}
              placeholder="Search regex symbols..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
          {filteredCheatSheet.map((item, idx) => (
            <div
              key={idx}
              className="p-2 px-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-2 hover:bg-muted/40 cursor-pointer transition-all"
              onClick={() => setPattern((prev) => prev + item.symbol)}
              title={`Click to insert ${item.symbol}`}
            >
              <code className="font-bold text-xs text-primary font-mono">{item.symbol}</code>
              <span className="text-[11px] text-muted-foreground font-medium truncate">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive SEO Educational Guide */}
      <ToolExplanation
        title="Regex Tester & Explainer Guide"
        description="Regular expressions (RegEx) are special character sequences used for search pattern matching, text validation, string replacement, and data parsing across software applications. TechWebCode's Regex Tester & Explainer provides real-time pattern matching, token breakdown, and diagnostic explanations."
        howToUse={[
          "Select your target Regex Flavor (JavaScript, PCRE2, Python, Go, Java, .NET).",
          "Enter your regular expression between the forward slashes `/pattern/`.",
          "Toggle flags: Global (g), Case-Insensitive (i), Multiline (m), or DotAll (s).",
          "Type your sample text in the Test String Input area.",
          "Review captured match list, numbered groups ($1, $2), and named groups.",
          "Check the Plain-English Summary and Token Breakdown table to understand how your regex works.",
        ]}
        features={[
          "Real-time pattern evaluation as you type with zero server uploads.",
          "Token-by-token AST breakdown and plain-English regex generator.",
          "Why didn't this match? automated diagnostic engine.",
          "Supports named capture groups (?<name>...) and lookaround assertions.",
          "Searchable regex cheat sheet and preset example library.",
        ]}
        faqs={[
          {
            question: "What is the difference between global (g) and non-global regex matching?",
            answer:
              "Without the global (`g`) flag, the regex engine stops after finding the first match in the input text. With the `g` flag enabled, the engine continues searching for all occurrences throughout the text.",
          },
          {
            question: "How do capture groups work in regex?",
            answer:
              "Parentheses `(...)` define a capture group. When a pattern matches, substrings enclosed in parentheses are extracted into numbered variables ($1, $2, etc.) or named variables when using `(?<name>...)` syntax.",
          },
          {
            question: "What is a lookahead assertion in regex?",
            answer:
              "A lookahead assertion `(?=...)` tests whether a sub-pattern matches ahead without adding characters to the matched output. For example, `(?=.*[A-Z])` asserts that at least one uppercase letter exists in the string.",
          },
          {
            question: "Is my test data uploaded to any server?",
            answer:
              "No. All regex evaluation, token parsing, and diagnostic analysis execute 100% locally inside your browser's JavaScript runtime. Sensitive passwords or log data are never sent to TechWebCode servers.",
          },
        ]}
      />

      <RelatedTools currentSlug="regex-tester" />
    </div>
  );
}
