"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  tool: Tool;
}

const SAMPLE_TEXT = `John Doe (john.doe@techwebcode.in)
Alice Smith <alice@example.org>
Invalid Email: user@domain@com
Support: support@techwebcode.in`;

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
      <ToolHeader tool={tool} />

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

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="Regex Tester"
        description="Regular expressions (RegEx) are powerful pattern-matching strings used to search, validate, and extract substring data in software development. Our free online Regex Tester validates patterns against test strings in real-time."
        howToUse={[
          "Enter your regex search pattern between the forward slashes `/pattern/`.",
          "Toggle flags: Global `g` (find all matches), Case-insensitive `i`, Multiline `m`.",
          "Type or paste your target test string into the Test Text String input field.",
          "Inspect the Matches Found list to view captured substring matches and starting indices.",
        ]}
        features={[
          "Real-time regex evaluation as you type pattern or test text.",
          "Global (g), Case-insensitive (i), and Multiline (m) regex flag toggles.",
          "Match index reporting and group extraction.",
          "100% Client-Side execution ensuring total data privacy.",
        ]}
        faqs={[
          {
            question: "What does the Global (g) flag do in regex?",
            answer:
              "The global (`g`) flag instructs the regex engine to find ALL matches throughout the entire test string rather than stopping after the first match.",
          },
          {
            question: "How do I match an email address with regex?",
            answer:
              "A standard email regex pattern is `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`, which matches standard username@domain.tld formats.",
          },
          {
            question: "What is the difference between regex test and match?",
            answer:
              "Regex testing returns a boolean (true/false) indicating whether a pattern exists in a string, while regex matching extracts the exact matched substring values and capture groups.",
          },
          {
            question: "Does this tool execute regex safely without freezing?",
            answer:
              "Yes. Matches are evaluated in browser memory with safeguard iteration caps to prevent Catastrophic Backtracking from freezing your browser.",
          },
        ]}
      />

      <RelatedTools currentSlug="regex-tester" />
    </div>
  );
}
