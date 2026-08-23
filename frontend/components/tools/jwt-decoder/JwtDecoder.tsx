"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Clock,
  Key,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  FileCode,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODMxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder({ tool }: Props) {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  const [expDate, setExpDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState(false);

  const decodeJwt = (jwtString: string) => {
    if (!jwtString.trim()) {
      setHeader("");
      setPayload("");
      setSignature("");
      setIsExpired(null);
      setErrorMessage("");
      return;
    }

    const parts = jwtString.trim().split(".");
    if (parts.length !== 3) {
      setErrorMessage("Invalid JWT Token structure. A valid JWT consists of 3 dot-separated Base64URL parts: Header.Payload.Signature");
      setHeader("");
      setPayload("");
      setSignature("");
      setIsExpired(null);
      return;
    }

    try {
      // Decode Header
      const headerObj = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      setHeader(JSON.stringify(headerObj, null, 2));

      // Decode Payload
      const payloadObj = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setPayload(JSON.stringify(payloadObj, null, 2));

      setSignature(parts[2]);
      setErrorMessage("");

      // Check Expiration
      if (payloadObj.exp) {
        const expTimeMs = payloadObj.exp * 1000;
        const now = Date.now();
        setIsExpired(now > expTimeMs);
        setExpDate(new Date(expTimeMs).toLocaleString() + " (" + new Date(expTimeMs).toUTCString() + ")");
      } else {
        setIsExpired(null);
        setExpDate("No expiration ('exp') claim present in token payload");
      }
    } catch (err: any) {
      setErrorMessage("Failed to decode JWT payload: " + (err.message || "Malformed Base64 string"));
      setHeader("");
      setPayload("");
      setSignature("");
      setIsExpired(null);
    }
  };

  useEffect(() => {
    decodeJwt(token);
  }, [token]);

  const handleCopyPayload = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    toast.success("Copied JWT Payload claims to clipboard!");
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyHeader = () => {
    if (!header) return;
    navigator.clipboard.writeText(header);
    setCopiedHeader(true);
    toast.success("Copied JWT Header to clipboard!");
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleClear = () => {
    setToken("");
    setHeader("");
    setPayload("");
    setSignature("");
    setIsExpired(null);
    setErrorMessage("");
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Security Disclaimer Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-500 text-xs leading-relaxed font-medium">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">Signature Verification & Security Disclaimer</span>
          <span>
            This tool decodes and inspects Base64-encoded JWT headers and payload claims client-side inside your browser.
            <strong> Decoding a JWT does NOT verify cryptographic signature secret integrity.</strong> Tokens are never transmitted to our backend servers.
          </span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setToken(SAMPLE_JWT)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <FileCode className="w-3.5 h-3.5 mr-1" />
            <span>Load Sample JWT</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Invalid JWT Token</div>
            <div className="mt-0.5 opacity-90">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Main Grid: Token Input vs Decoded Claims */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Token Input (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Raw Encoded JWT Token
          </span>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here (eyJhbGci...)"
            className="w-full h-[420px] p-4 bg-muted/20 rounded-xl border border-border font-mono text-xs leading-relaxed resize-none outline-none focus:ring-2 focus:ring-primary break-all editor-scroll-area"
          />
        </div>

        {/* Decoded Claims (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Expiration Status Alert */}
          {isExpired !== null && (
            <div
              className={`flex items-center justify-between p-3.5 px-4 rounded-xl border text-xs font-semibold ${
                isExpired
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Token Expiration Status: {isExpired ? "EXPIRED" : "ACTIVE / VALID"}</span>
              </div>
              <span className="font-mono text-[11px] opacity-90">{expDate}</span>
            </div>
          )}

          {/* Decoded Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Header (Algorithm & Token Type)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!header}
                onClick={handleCopyHeader}
                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
              >
                {copiedHeader ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span className="ml-1">{copiedHeader ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <CodeEditor
              value={header}
              readOnly
              language="json"
              placeholder="Decoded Header JSON will appear here..."
              height="140px"
            />
          </div>

          {/* Decoded Payload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Payload (Data Claims)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!payload}
                onClick={handleCopyPayload}
                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
              >
                {copiedPayload ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span className="ml-1">{copiedPayload ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <CodeEditor
              value={payload}
              readOnly
              language="json"
              placeholder="Decoded Payload JSON claims will appear here..."
              height="200px"
            />
          </div>
        </div>
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JWT Decoder & Inspector"
        description="JSON Web Token (JWT) is an open standard (RFC 7519) used for securely transmitting claims between web clients and backend services. Our free online JWT Decoder allows developers to inspect JWT headers, payload claims, and token expiration dates instantly."
        howToUse={[
          "Paste your encoded JWT string (e.g. eyJhbGci...) into the raw token text input area.",
          "The tool automatically splits the token into Header, Payload, and Signature components.",
          "Inspect claims such as 'sub' (subject), 'iat' (issued at), and 'exp' (expiration timestamp).",
          "Check the Expiration status banner to verify whether the token is active or expired.",
        ]}
        features={[
          "100% Client-Side: JWT tokens are parsed entirely in your browser memory and never transmitted to external servers.",
          "Automatic Header & Payload JSON formatting with syntax highlighting.",
          "Expiration date inspector converting Epoch timestamps into human-readable local and UTC dates.",
          "One-click copy for decoded JSON claims.",
        ]}
        faqs={[
          {
            question: "Does decoding a JWT verify its cryptographic signature?",
            answer:
              "No. Decoding only extracts and parses the Base64URL-encoded JSON payload claims inside your browser. Verifying a JWT signature requires checking the cryptographic hash using your server's secret key or public RSA certificate.",
          },
          {
            question: "Is it safe to paste JWT tokens into this online tool?",
            answer:
              "Yes! TechWebCode decodes JWT tokens 100% client-side in your web browser memory. Tokens are never transmitted to external servers or recorded in logs.",
          },
          {
            question: "What are the three parts of a JSON Web Token?",
            answer:
              "A JWT consists of three dot-separated Base64URL parts: Header (specifying algorithm and token type), Payload (containing user claims and metadata), and Signature (used for authentication).",
          },
          {
            question: "What does the 'exp' claim represent in a JWT payload?",
            answer:
              "The 'exp' (expiration time) claim contains a Unix Epoch timestamp indicating the exact date and time after which the token is invalid.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="jwt-decoder" />
    </div>
  );
}
