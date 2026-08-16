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
  { id: 8, name: "URL Encoder & Decoder", slug: "url-encoder" },
  { id: 9, name: "Regex Tester & Explainer", slug: "regex-tester" },
  { id: 10, name: "SQL Query Formatter", slug: "sql-formatter" },
  { id: 11, name: "YAML Formatter & Kubernetes Secret", slug: "yaml-formatter" },
  { id: 22, name: "Deployment Config Doctor", slug: "deployment-config-doctor" },
  { id: 25, name: "API Contract Checker", slug: "api-contract-checker" },
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
        description: "Format, beautify, and inspect JSON.",
        icon: FileCode,
        badge: "FEATURED",
      },
      {
        id: 2,
        name: "JSON Validator",
        slug: "json-validator",
        href: "/tools/json-validator",
        description: "Validate JSON syntax with line errors.",
        icon: CheckCircle2,
      },
      {
        id: 3,
        name: "JSON Minifier",
        slug: "json-minifier",
        href: "/tools/json-minifier",
        description: "Compress JSON payloads to single line.",
        icon: Minimize2,
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
        description: "Test, debug, and understand regex.",
        icon: Code2,
        badge: "FEATURED",
      },
      {
        id: 10,
        name: "SQL Query Formatter",
        slug: "sql-formatter",
        href: "/tools/sql-formatter",
        description: "Format and beautify SQL queries.",
        icon: Database,
      },
    ],
  },
  {
    title: "API & DEVOPS",
    tools: [
      {
        id: 25,
        name: "API Contract Checker",
        slug: "api-contract-checker",
        href: "/tools/api-contract-checker",
        description: "Detect API contract and compatibility issues.",
        icon: ArrowRightLeft,
        badge: "NEW",
      },
      {
        id: 22,
        name: "Deployment Config Doctor",
        slug: "deployment-config-doctor",
        href: "/tools/deployment-config-doctor",
        description: "Diagnose Docker, Kubernetes & config issues.",
        icon: ShieldCheck,
        badge: "NEW",
      },
    ],
  },
  {
    title: "YAML & KUBERNETES",
    tools: [
      {
        id: 11,
        name: "YAML Formatter & K8s Secret",
        slug: "yaml-formatter",
        href: "/tools/yaml-formatter",
        description: "Format YAML and create Kubernetes Secrets.",
        icon: FileText,
      },
    ],
  },
  {
    title: "TEXT & ENCODING",
    tools: [
      {
        id: 5,
        name: "Base64 Encoder / Decoder",
        slug: "base64",
        href: "/tools/base64",
        description: "Encode and decode Base64 strings.",
        icon: ArrowLeftRight,
      },
      {
        id: 8,
        name: "URL Encoder / Decoder",
        slug: "url-encoder",
        href: "/tools/url-encoder",
        description: "Percent-encode and decode URL parameters.",
        icon: LinkIcon,
      },
    ],
  },
  {
    title: "SECURITY",
    tools: [
      {
        id: 4,
        name: "JWT Decoder",
        slug: "jwt-decoder",
        href: "/tools/jwt-decoder",
        description: "Inspect JSON Web Token claims & expiry.",
        icon: Key,
      },
    ],
  },
  {
    title: "GENERATORS",
    tools: [
      {
        id: 6,
        name: "UUID / GUID Generator",
        slug: "uuid-generator",
        href: "/tools/uuid-generator",
        description: "Generate random RFC 4122 v4 UUIDs.",
        icon: RefreshCw,
      },
    ],
  },
  {
    title: "DATE & TIME",
    tools: [
      {
        id: 7,
        name: "Unix Timestamp Converter",
        slug: "timestamp-converter",
        href: "/tools/timestamp-converter",
        description: "Convert Epoch timestamps to human dates.",
        icon: Clock,
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
