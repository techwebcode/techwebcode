import YAML from "yaml";
import { ProjectFile, Finding } from "../types";

export interface ParsedK8sResource {
  file: string;
  kind: string;
  name: string;
  namespace?: string;
  labels: Record<string, string>;
  selectors: Record<string, string>;
  ports: number[];
  targetPorts: number[];
  envVars: string[];
  configMapRefs: string[];
  secretRefs: string[];
  raw: any;
}

/**
 * Analyzes Kubernetes YAML manifests (Deployment, Service, ConfigMap, Secret, Ingress, etc.)
 */
export function runK8sAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const k8sFiles = files.filter((f) => f.type === "kubernetes");

  if (k8sFiles.length === 0) return findings;

  const parsedResources: ParsedK8sResource[] = [];

  // 1. Parse YAML documents
  k8sFiles.forEach((file) => {
    try {
      const docs = YAML.parseAllDocuments(file.content);
      docs.forEach((doc) => {
        const json = doc.toJSON();
        if (!json || typeof json !== "object" || !json.kind) return;

        const kind = json.kind;
        const name = json.metadata?.name || "unnamed";
        const namespace = json.metadata?.namespace || "default";
        const labels = json.metadata?.labels || {};
        const selectors = json.spec?.selector?.matchLabels || json.spec?.selector || {};
        const ports: number[] = [];
        const targetPorts: number[] = [];
        const envVars: string[] = [];
        const configMapRefs: string[] = [];
        const secretRefs: string[] = [];

        // Parse ports from spec
        if (json.spec?.ports && Array.isArray(json.spec.ports)) {
          json.spec.ports.forEach((p: any) => {
            if (p.port) ports.push(p.port);
            if (p.targetPort) targetPorts.push(typeof p.targetPort === "number" ? p.targetPort : parseInt(p.targetPort, 10));
          });
        }

        // Parse Deployment containers
        if (json.spec?.template?.spec?.containers) {
          json.spec.template.spec.containers.forEach((c: any) => {
            if (c.ports) {
              c.ports.forEach((cp: any) => cp.containerPort && targetPorts.push(cp.containerPort));
            }
            if (c.env) {
              c.env.forEach((e: any) => {
                if (e.name) envVars.push(e.name);
                if (e.valueFrom?.configMapKeyRef?.name) configMapRefs.push(e.valueFrom.configMapKeyRef.name);
                if (e.valueFrom?.secretKeyRef?.name) secretRefs.push(e.valueFrom.secretKeyRef.name);
              });
            }
            if (c.envFrom) {
              c.envFrom.forEach((ef: any) => {
                if (ef.configMapRef?.name) configMapRefs.push(ef.configMapRef.name);
                if (ef.secretRef?.name) secretRefs.push(ef.secretRef.name);
              });
            }
          });
        }

        parsedResources.push({
          file: file.path,
          kind,
          name,
          namespace,
          labels,
          selectors,
          ports,
          targetPorts,
          envVars,
          configMapRefs,
          secretRefs,
          raw: json,
        });

        // Security check: Base64 encoding notice in Secret
        if (kind === "Secret") {
          findings.push({
            id: `K8S-SECRET-BASE64-${file.path}-${name}`,
            ruleId: "K8S-SEC-001",
            severity: "info",
            title: `Kubernetes Secret '${name}' Base64 Encoding Notice`,
            explanation: `Base64 encoding in Kubernetes Secret manifests is an encoding scheme, NOT encryption. Anyone with repository access can decode Secret values.`,
            affectedFile: file.path,
            recommendedFix: "Store production credentials using external secret stores (e.g., HashiCorp Vault, AWS Secrets Manager, or SealedSecrets).",
          });
        }

        // Check if sensitive credentials exist in ConfigMap
        if (kind === "ConfigMap" && json.data) {
          Object.keys(json.data).forEach((k) => {
            const upperKey = k.toUpperCase();
            if (upperKey.includes("SECRET") || upperKey.includes("PASSWORD") || upperKey.includes("TOKEN") || upperKey.includes("KEY")) {
              findings.push({
                id: `K8S-CONFIGMAP-SECRET-${file.path}-${name}-${k}`,
                ruleId: "K8S-SEC-002",
                severity: "error",
                title: `Sensitive Credential '${k}' Exposed in ConfigMap`,
                explanation: `ConfigMap '${name}' contains sensitive key '${k}'. Sensitive credentials should be stored in a Kubernetes Secret object instead of a ConfigMap.`,
                affectedFile: file.path,
                recommendedFix: `Move '${k}' from ConfigMap '${name}' to a dedicated Kubernetes Secret manifest.`,
              });
            }
          });
        }
      });
    } catch (err) {
      // Ignore parse error
    }
  });

  const deployments = parsedResources.filter((r) => r.kind === "Deployment" || r.kind === "StatefulSet");
  const services = parsedResources.filter((r) => r.kind === "Service");
  const ingresses = parsedResources.filter((r) => r.kind === "Ingress");
  const configMaps = new Set(parsedResources.filter((r) => r.kind === "ConfigMap").map((r) => r.name));
  const secrets = new Set(parsedResources.filter((r) => r.kind === "Secret").map((r) => r.name));

  // 2. Cross-Resource: Service → Deployment selector matching
  services.forEach((svc) => {
    if (Object.keys(svc.selectors).length > 0) {
      const matchingDep = deployments.find((dep) => {
        return Object.entries(svc.selectors).every(([k, v]) => dep.labels[k] === v || dep.raw?.spec?.template?.metadata?.labels?.[k] === v);
      });

      if (!matchingDep) {
        findings.push({
          id: `K8S-SVC-SELECTOR-MISMATCH-${svc.name}`,
          ruleId: "K8S-001",
          severity: "error",
          title: `Service '${svc.name}' Selector Mismatch`,
          explanation: `Service '${svc.name}' defines selectors ${JSON.stringify(svc.selectors)}, but no Deployment or StatefulSet labels match. Traffic will fail to route to pods.`,
          affectedFile: svc.file,
          recommendedFix: `Update Service '${svc.name}' spec.selector to match your Deployment pod labels (e.g. 'app: ${svc.name}').`,
        });
      }
    }
  });

  // 3. Cross-Resource: Ingress → Service backend matching
  ingresses.forEach((ing) => {
    const rules = ing.raw?.spec?.rules || [];
    rules.forEach((rule: any) => {
      const paths = rule.http?.paths || [];
      paths.forEach((p: any) => {
        const targetSvcName = p.backend?.service?.name || p.backend?.serviceName;
        if (targetSvcName && !services.some((s) => s.name === targetSvcName)) {
          findings.push({
            id: `K8S-INGRESS-SVC-MISSING-${ing.name}-${targetSvcName}`,
            ruleId: "K8S-002",
            severity: "error",
            title: `Ingress Backend Service '${targetSvcName}' Missing`,
            explanation: `Ingress '${ing.name}' routes traffic to backend Service '${targetSvcName}', but no matching Service manifest was found in the project.`,
            affectedFile: ing.file,
            recommendedFix: `Create a Service manifest named '${targetSvcName}' or update Ingress backend service.name.`,
          });
        }
      });
    });
  });

  // 4. Cross-Resource: Deployment → missing ConfigMap or Secret references
  deployments.forEach((dep) => {
    dep.configMapRefs.forEach((cmRef) => {
      if (!configMaps.has(cmRef)) {
        findings.push({
          id: `K8S-DEP-CONFIGMAP-MISSING-${dep.name}-${cmRef}`,
          ruleId: "K8S-003",
          severity: "error",
          title: `Deployment '${dep.name}' References Missing ConfigMap '${cmRef}'`,
          explanation: `Deployment '${dep.name}' attempts to load environment variables from ConfigMap '${cmRef}', but no ConfigMap named '${cmRef}' exists.`,
          affectedFile: dep.file,
          recommendedFix: `Create a ConfigMap manifest with 'metadata.name: ${cmRef}'.`,
        });
      }
    });

    dep.secretRefs.forEach((secRef) => {
      if (!secrets.has(secRef)) {
        findings.push({
          id: `K8S-DEP-SECRET-MISSING-${dep.name}-${secRef}`,
          ruleId: "K8S-004",
          severity: "error",
          title: `Deployment '${dep.name}' References Missing Secret '${secRef}'`,
          explanation: `Deployment '${dep.name}' references Secret '${secRef}', but no Secret manifest named '${secRef}' exists. Pod startup will fail with CreateContainerConfigError.`,
          affectedFile: dep.file,
          recommendedFix: `Create a Secret manifest with 'metadata.name: ${secRef}'.`,
        });
      }
    });
  });

  return findings;
}
