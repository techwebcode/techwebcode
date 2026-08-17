import React from "react";
import Image from "next/image";
import { FileCode, Database, ShieldCheck, Terminal, Code2, Braces } from "lucide-react";

interface ArticleThumbnailProps {
  src?: string | null;
  alt: string;
  categorySlug?: string;
  categoryName?: string;
}

export default function ArticleThumbnail({
  src,
  alt,
  categorySlug = "",
  categoryName = "",
}: ArticleThumbnailProps) {
  // Check if real image URL exists (and is not default placeholder text image)
  const hasRealImage =
    src &&
    typeof src === "string" &&
    src.trim().length > 0 &&
    !src.includes("article-placeholder.jpg") &&
    !src.includes("placeholder");

  if (hasRealImage) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Category-based fallback visuals (16:9 ratio with code/architecture aesthetics)
  const slug = (categorySlug || categoryName).toLowerCase();

  if (slug.includes("json") || slug.includes("data") || slug.includes("tutorial")) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 p-4 font-mono text-slate-200 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Braces className="h-3 w-3 text-blue-400" /> payload.json
          </span>
        </div>

        <div className="space-y-1 text-xs opacity-90 my-auto">
          <div><span className="text-purple-400">&#123;</span></div>
          <div className="pl-3"><span className="text-blue-400">&quot;status&quot;</span>: <span className="text-amber-300">200</span>,</div>
          <div className="pl-3"><span className="text-blue-400">&quot;format&quot;</span>: <span className="text-emerald-300">&quot;beautified&quot;</span>,</div>
          <div className="pl-3"><span className="text-blue-400">&quot;valid&quot;</span>: <span className="text-purple-300">true</span></div>
          <div><span className="text-purple-400">&#125;</span></div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span>JSON &amp; DATA ENGINE</span>
          <span className="text-blue-400 font-bold">TechWebCode</span>
        </div>
      </div>
    );
  }

  if (slug.includes("regex") || slug.includes("sql") || slug.includes("database")) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 p-4 font-mono text-slate-200 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Database className="h-3 w-3 text-emerald-400" /> query_test.sql
          </span>
        </div>

        <div className="space-y-1 text-xs opacity-90 my-auto">
          <div><span className="text-purple-400">SELECT</span> id, name, email</div>
          <div><span className="text-purple-400">FROM</span> users <span className="text-blue-400">WHERE</span> status = <span className="text-emerald-300">&apos;active&apos;</span></div>
          <div className="text-slate-500">// Regex: /^([a-zA-Z0-9_\.-]+)@/</div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span>REGEX &amp; QUERY ANALYZER</span>
          <span className="text-emerald-400 font-bold">TechWebCode</span>
        </div>
      </div>
    );
  }

  if (slug.includes("security") || slug.includes("jwt") || slug.includes("auth")) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 p-4 font-mono text-slate-200 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-amber-400" /> token_verify.jwt
          </span>
        </div>

        <div className="space-y-1 text-xs opacity-90 my-auto truncate">
          <div className="truncate text-rose-400 font-semibold">eyJhbGciOiJIUzI1NiIsInR5c...</div>
          <div className="truncate text-purple-400">.eyJzdWIiOiIxMjM0NTY3ODkw...</div>
          <div className="truncate text-cyan-400">.SflKxwRJSMeKKF2QT4fwpMeJf...</div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span>SECURITY &amp; TOKEN INSPECTOR</span>
          <span className="text-amber-400 font-bold">TechWebCode</span>
        </div>
      </div>
    );
  }

  if (slug.includes("devops") || slug.includes("docker") || slug.includes("k8s") || slug.includes("kubernetes")) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 p-4 font-mono text-slate-200 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Terminal className="h-3 w-3 text-cyan-400" /> deployment.yaml
          </span>
        </div>

        <div className="space-y-1 text-xs opacity-90 my-auto">
          <div><span className="text-blue-400">apiVersion</span>: <span className="text-emerald-300">apps/v1</span></div>
          <div><span className="text-blue-400">kind</span>: <span className="text-amber-300">Deployment</span></div>
          <div><span className="text-blue-400">replicas</span>: <span className="text-purple-300">3</span></div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
          <span>INFRASTRUCTURE &amp; CONTAINERS</span>
          <span className="text-cyan-400 font-bold">TechWebCode</span>
        </div>
      </div>
    );
  }

  // Default General Engineering Visual
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 p-4 font-mono text-slate-200 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
          <Code2 className="h-3 w-3 text-blue-400" /> main.ts
        </span>
      </div>

      <div className="space-y-1 text-xs opacity-90 my-auto">
        <div><span className="text-purple-400">export function</span> <span className="text-blue-400">solve</span>() &#123;</div>
        <div className="pl-3 text-slate-400">// Practical developer tools</div>
        <div className="pl-3"><span className="text-purple-400">return</span> <span className="text-emerald-300">&quot;optimized&quot;</span>;</div>
        <div>&#125;</div>
      </div>

      <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-1.5">
        <span>ENGINEERING PUBLICATION</span>
        <span className="text-blue-400 font-bold">TechWebCode</span>
      </div>
    </div>
  );
}
