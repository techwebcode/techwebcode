"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import { Tool } from "@/types/tools";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  tool: Tool;
}

const SAMPLE_TEXT = `John Doe (john.doe@techwebcode.com)
Alice Smith <alice@example.org>
Invalid Email: user@domain@com
Support: support@techwebcode.com`;

interface MatchItem {
  index: number;
  match: string;
  groups: string[];
}

export default function RegexTester({ tool }: Props) {
  const [pattern, setPattern] = useState(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`);
  const [flags, setFlags] = useState({ g: true, i: true, m: true });
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const testRegex = () => {
    if (!pattern.trim() || !testText) {
      setMatches([]);
      setErrorMsg("");
      return;
    }

    try {
      const flagStr = (flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "");
      const regex = new RegExp(pattern, flagStr);
      const list: MatchItem[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = regex.exec(testText)) !== null) {
          list.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          });
          count++;
          if (count > 200) break; // Safeguard
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          list.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          });
        }
      }

      setMatches(list);
      setErrorMsg("");
    } catch (err: any) {
      setMatches([]);
      setErrorMsg(err.message || "Invalid Regular Expression syntax");
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  return (
    <div className="space-y-6">
      <ToolHeader
        title={tool.name || "Regex Pattern Tester"}
        description={tool.description || "Test regular expression patterns in real-time with match highlighting and group extraction."}
      />

      {/* Regex Pattern Bar */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Regular Expression Pattern
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 flex items-center bg-muted/30 border border-border rounded-lg px-3 py-1 font-mono text-sm">
            <span className="text-primary font-bold mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-z]+"
              className="flex-1 bg-transparent border-none outline-none text-foreground"
            />
            <span className="text-primary font-bold ml-1">/</span>
            <span className="text-muted-foreground text-xs ml-1">
              {(flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "")}
            </span>
          </div>

          {/* Flags Selector */}
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-2 rounded-lg border border-border text-xs font-medium">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
              />
              <span>Global (g)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
              />
              <span>Case-Insensitive (i)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
              />
              <span>Multiline (m)</span>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-500 font-mono flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test Text Input */}
        <ToolInput
          label="Test Text String"
          value={testText}
          onChange={setTestText}
          placeholder="Paste test string here..."
          onLoadSample={() => setTestText(SAMPLE_TEXT)}
        />

        {/* Match Results */}
        <div className="flex flex-col rounded-xl border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b text-xs font-semibold">
            <span className="uppercase tracking-wider text-muted-foreground">
              Matches Found ({matches.length})
            </span>
            {matches.length > 0 && (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Match Active
              </span>
            )}
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[300px] font-mono text-xs">
            {matches.length === 0 ? (
              <div className="text-muted-foreground italic">No pattern matches found in input string.</div>
            ) : (
              matches.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border bg-muted/20 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">Match #{idx + 1}</span>
                    <span className="text-[10px] text-muted-foreground">Index: {item.index}</span>
                  </div>
                  <div className="bg-background p-1.5 rounded border font-semibold text-emerald-400 break-all">
                    {item.match}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
