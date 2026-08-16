import React from "react";
import { ProjectFile, Finding } from "./types";
import { ArrowRight, CheckCircle2, AlertOctagon, Layers, Server, Globe, Database, ShieldAlert } from "lucide-react";

interface Props {
  files: ProjectFile[];
  findings: Finding[];
}

export default function RelationshipGraphView({ files, findings }: Props) {
  const hasNginx = files.some((f) => f.type === "nginx");
  const hasK8sIngress = files.some((f) => f.type === "kubernetes" && f.content.includes("kind: Ingress"));
  const hasCompose = files.some((f) => f.type === "docker-compose");
  const hasK8sSvc = files.some((f) => f.type === "kubernetes" && f.content.includes("kind: Service"));
  const hasDockerfile = files.some((f) => f.type === "dockerfile");
  const hasEnv = files.some((f) => f.type === "env");

  const composeErrors = findings.filter((f) => f.ruleId.startsWith("CMP") || f.ruleId.startsWith("NGX"));
  const k8sErrors = findings.filter((f) => f.ruleId.startsWith("K8S"));

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>Cross-Platform Architecture Relationship Graph</span>
        </h3>
        <span className="text-xs text-muted-foreground font-medium">Topology Audit</span>
      </div>

      <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
        {/* Chain 1: Ingress / Nginx Proxy */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>Reverse Proxy / Ingress</span>
          </div>

          <div className="flex items-center gap-2">
            {hasNginx || hasK8sIngress ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Configured ({hasNginx ? "Nginx" : "K8s Ingress"})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                Direct Host Port
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center my-1">
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
        </div>

        {/* Chain 2: Orchestration Layer (Compose / K8s Services) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-500" />
            <span>Container Service Layer</span>
          </div>

          <div className="flex items-center gap-2">
            {hasCompose || hasK8sSvc ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected ({hasCompose ? "Docker Compose" : "K8s Services"})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> Unlinked Services
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center my-1">
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
        </div>

        {/* Chain 3: App Container & Environment */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Application Containers & Secrets</span>
          </div>

          <div className="flex items-center gap-2">
            {hasDockerfile && hasEnv ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Dockerfile + .env Linked
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                Partial Config
              </span>
            )}
          </div>
        </div>
      </div>

      {(composeErrors.length > 0 || k8sErrors.length > 0) && (
        <div className="p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 text-xs space-y-1 font-medium">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Detected Broken Architecture Connections:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 opacity-95">
            {composeErrors.map((e) => (
              <li key={e.id}>{e.title} ({e.affectedFile})</li>
            ))}
            {k8sErrors.map((e) => (
              <li key={e.id}>{e.title} ({e.affectedFile})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
