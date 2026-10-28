import {
  FileCode,
  CheckCircle2,
  Minimize2,
  Code2,
  Database,
  FileText,
  ArrowRightLeft,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Link as LinkIcon,
  RefreshCw,
  Clock,
  BookOpen,
  GraduationCap,
  Compass,
  Wrench,
  Terminal,
} from "lucide-react";

export interface ToolNavItem {
  id?: number;
  name: string;
  slug: string;
  href: string;
  description: string;
  icon: any;
  badge?: "NEW" | "FEATURED";
}

export interface ToolCategoryGroup {
  title: string;
  tools: ToolNavItem[];
}

export const FALLBACK_TOOLS = [
  { id: 1, name: "JSON Formatter & Beautifier", slug: "json-formatter" },
  { id: 2, name: "JSON Validator", slug: "json-validator" },
  { id: 3, name: "JSON Minifier", slug: "json-minifier" },
  { id: 4, name: "JWT Decoder", slug: "jwt-decoder" },
  { id: 5, name: "Base64 Encoder & Decoder", slug: "base64" },
  { id: 6, name: "UUID / GUID Generator", slug: "uuid-generator" },
  { id: 7, name: "Unix Timestamp Converter", slug: "timestamp-converter" },
  { id: 8, name: "URL Encoder & Decoder", slug: "url-encoder-decoder" },
  { id: 9, name: "Regex Tester & Explainer", slug: "regex-tester" },
  { id: 10, name: "SQL Formatter & Validator", slug: "sql-formatter" },
  { id: 11, name: "YAML Formatter & Kubernetes Secret", slug: "yaml-formatter" },
  { id: 22, name: "Deployment Config Doctor", slug: "deployment-config-doctor" },
  { id: 25, name: "API Contract Checker", slug: "api-contract-checker" },
  { id: 28, name: "Code Difference Checker", slug: "code-diff-checker" },
  { id: 19, name: "SHA-1 Hash Generator", slug: "sha1-hash-generator" },
  { id: 20, name: "Comma Separator", slug: "comma-separator" },
];

export const TOOL_NAV_CATEGORIES: ToolCategoryGroup[] = [
  {
    title: "JSON & DATA",
    tools: [
      {
        id: 1,
        name: "JSON Formatter",
        slug: "json-formatter",
        href: "/tools/json-formatter",
        description: "Format, beautify, and inspect JSON payloads.",
        icon: FileCode,
        badge: "FEATURED",
      },
      {
        id: 2,
        name: "JSON Validator",
        slug: "json-validator",
        href: "/tools/json-validator",
        description: "Validate JSON syntax with line-by-line error checks.",
        icon: CheckCircle2,
      },
      {
        id: 3,
        name: "JSON Minifier",
        slug: "json-minifier",
        href: "/tools/json-minifier",
        description: "Compact JSON payloads to reduce transfer size.",
        icon: Minimize2,
      },
      {
        id: 28,
        name: "Code Difference Checker",
        slug: "code-diff-checker",
        href: "/tools/code-diff-checker",
        description: "Compare code versions side-by-side with diff highlighting.",
        icon: ArrowLeftRight,
        badge: "NEW",
      },
    ],
  },
  {
    title: "SECURITY & CRYPTO",
    tools: [
      {
        id: 4,
        name: "JWT Decoder",
        slug: "jwt-decoder",
        href: "/tools/jwt-decoder",
        description: "Inspect JSON Web Token claims, headers, and expiry.",
        icon: Key,
      },
      {
        id: 5,
        name: "Base64 Encoder & Decoder",
        slug: "base64",
        href: "/tools/base64",
        description: "Encode text to Base64 format or decode back to text.",
        icon: ArrowRightLeft,
      },
      {
        id: 19,
        name: "SHA-1 Hash Generator",
        slug: "sha1-hash-generator",
        href: "/tools/sha1-hash-generator",
        description: "Generate 40-character SHA-1 cryptographic hash digests.",
        icon: Key,
        badge: "NEW",
      },
      {
        id: 6,
        name: "UUID / GUID Generator",
        slug: "uuid-generator",
        href: "/tools/uuid-generator",
        description: "Generate random RFC 4122 Version 4 UUID identifiers.",
        icon: RefreshCw,
      },
    ],
  },
  {
    title: "DEVOPS & CLOUD",
    tools: [
      {
        id: 11,
        name: "YAML Formatter & K8s Secret",
        slug: "yaml-formatter",
        href: "/tools/yaml-formatter",
        description: "Format YAML manifests and manage Kubernetes Secrets.",
        icon: FileText,
      },
      {
        id: 22,
        name: "Deployment Config Doctor",
        slug: "deployment-config-doctor",
        href: "/tools/deployment-config-doctor",
        description: "Diagnose Docker, Kubernetes, and environment files.",
        icon: ShieldCheck,
        badge: "NEW",
      },
      {
        id: 25,
        name: "API Contract Checker",
        slug: "api-contract-checker",
        href: "/tools/api-contract-checker",
        description: "Detect API contract schema breaking changes.",
        icon: ArrowRightLeft,
        badge: "NEW",
      },
    ],
  },
  {
    title: "REGEX & SQL",
    tools: [
      {
        id: 9,
        name: "Regex Tester & Explainer",
        slug: "regex-tester",
        href: "/tools/regex-tester",
        description: "Test and debug regular expressions with match breakdowns.",
        icon: Code2,
        badge: "FEATURED",
      },
      {
        id: 10,
        name: "SQL Formatter & Validator",
        slug: "sql-formatter",
        href: "/tools/sql-formatter",
        description: "Format, validate, and minify SQL queries online.",
        icon: Database,
      },
    ],
  },
  {
    title: "WEB UTILITIES",
    tools: [
      {
        id: 8,
        name: "URL Encoder & Decoder",
        slug: "url-encoder-decoder",
        href: "/tools/url-encoder-decoder",
        description: "Percent-encode and decode URL query parameters.",
        icon: LinkIcon,
      },
      {
        id: 7,
        name: "Unix Timestamp Converter",
        slug: "timestamp-converter",
        href: "/tools/timestamp-converter",
        description: "Convert Unix Epoch timestamps to UTC and local dates.",
        icon: Clock,
      },
      {
        id: 20,
        name: "Comma Separator",
        slug: "comma-separator",
        href: "/tools/comma-separator",
        description: "Convert lists to comma-separated values with deduplication.",
        icon: FileText,
        badge: "NEW",
      },
    ],
  },
];

export const ARTICLE_DROPDOWN_ITEMS = [
  {
    title: "Latest Articles",
    href: "/articles",
    description: "Browse all software engineering articles & news.",
    icon: BookOpen,
  },
  {
    title: "Tutorials",
    href: "/articles?category=tutorials",
    description: "Step-by-step programming & web dev tutorials.",
    icon: GraduationCap,
  },
  {
    title: "Developer Guides",
    href: "/articles?category=guides",
    description: "In-depth technical architecture guides.",
    icon: Compass,
  },
  {
    title: "DevOps & Cloud",
    href: "/articles?category=devops",
    description: "Docker, Kubernetes, CI/CD, and Nginx guides.",
    icon: Terminal,
  },
  {
    title: "Troubleshooting",
    href: "/articles?category=troubleshooting",
    description: "Solutions to common framework & API errors.",
    icon: Wrench,
  },
];
