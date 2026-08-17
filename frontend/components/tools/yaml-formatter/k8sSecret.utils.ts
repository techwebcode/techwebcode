import YAML from "yaml";

export interface K8sSecretInfo {
  isKubernetesSecret: boolean;
  name: string;
  namespace: string;
  secretType: string;
  dataCount: number;
  stringDataCount: number;
  totalKeys: number;
  storageType: "data" | "stringData" | "mixed" | "empty";
  isAlreadyBase64: boolean;
}

export interface K8sValidationError {
  line?: number;
  key?: string;
  message: string;
}

export interface K8sValidationResult {
  valid: boolean;
  errors: K8sValidationError[];
}

export interface SecretKeyTransformationDetail {
  key: string;
  from: string;
  to: string;
  transformed: boolean;
}

export interface SecretTransformationSummary {
  detectedCount: number;
  transformedCount: number;
  unchangedCount: number;
  details: SecretKeyTransformationDetail[];
}

export const SAMPLE_K8S_SECRET_YAML = `apiVersion: v1
kind: Secret
metadata:
  name: my-app-secret
  namespace: production
  labels:
    app: my-app
    tier: backend
type: Opaque
data:
  DB_PASSWORD: c3VwZXItc2VjcmV0LXBhc3N3b3JkLTEyMw==
  API_KEY: c2tfbGl2ZV81MU54ODkyMzg5MTI4MzkxMjM4OTEy
  JWT_SECRET: bXktc3VwZXItc2VjcmV0LWp3dC1rZXk=
`;

export const SAMPLE_DECODED_SECRET_YAML = `apiVersion: v1
kind: Secret
metadata:
  name: my-app-secret
  namespace: production
  labels:
    app: my-app
    tier: backend
type: Opaque
stringData:
  DB_PASSWORD: super-secret-password-123
  API_KEY: sk_live_51Nx892389128391238912
  JWT_SECRET: my-super-secret-jwt-key
`;

function isValidBase64(str: string): boolean {
  if (typeof str !== "string" || !str.trim()) return false;
  const trimmed = str.trim();

  // Basic Base64 regex check
  if (!/^[A-Za-z0-9+/=]+$/.test(trimmed)) return false;

  try {
    const decoded = atob(trimmed);
    return btoa(decoded) === trimmed || btoa(decoded).replace(/=/g, "") === trimmed.replace(/=/g, "");
  } catch {
    return false;
  }
}

export function detectKubernetesSecret(yamlStr: string): K8sSecretInfo {
  const defaultInfo: K8sSecretInfo = {
    isKubernetesSecret: false,
    name: "",
    namespace: "default",
    secretType: "Opaque",
    dataCount: 0,
    stringDataCount: 0,
    totalKeys: 0,
    storageType: "empty",
    isAlreadyBase64: false,
  };

  if (!yamlStr || !yamlStr.trim()) return defaultInfo;

  try {
    const doc = YAML.parse(yamlStr);
    if (!doc || typeof doc !== "object") return defaultInfo;

    const isSecret = doc.kind === "Secret";
    if (!isSecret) return defaultInfo;

    const name = doc.metadata?.name || "unnamed-secret";
    const namespace = doc.metadata?.namespace || "default";
    const secretType = doc.type || "Opaque";

    const dataObj = doc.data && typeof doc.data === "object" ? doc.data : {};
    const stringDataObj = doc.stringData && typeof doc.stringData === "object" ? doc.stringData : {};

    const dataKeys = Object.keys(dataObj);
    const stringDataKeys = Object.keys(stringDataObj);

    const dataCount = dataKeys.length;
    const stringDataCount = stringDataKeys.length;
    const totalKeys = dataCount + stringDataCount;

    let storageType: "data" | "stringData" | "mixed" | "empty" = "empty";
    if (dataCount > 0 && stringDataCount > 0) storageType = "mixed";
    else if (dataCount > 0) storageType = "data";
    else if (stringDataCount > 0) storageType = "stringData";

    let isAlreadyBase64 = false;
    if (dataCount > 0) {
      isAlreadyBase64 = dataKeys.every((key) => {
        const val = String(dataObj[key] || "");
        return isValidBase64(val);
      });
    }

    return {
      isKubernetesSecret: true,
      name,
      namespace,
      secretType,
      dataCount,
      stringDataCount,
      totalKeys,
      storageType,
      isAlreadyBase64,
    };
  } catch {
    return defaultInfo;
  }
}

export function validateKubernetesSecret(yamlStr: string): K8sValidationResult {
  const result: K8sValidationResult = { valid: true, errors: [] };
  if (!yamlStr || !yamlStr.trim()) return result;

  const lines = yamlStr.split("\n");

  try {
    const doc = YAML.parse(yamlStr);
    if (!doc || typeof doc !== "object") {
      result.valid = false;
      result.errors.push({ message: "Invalid YAML syntax." });
      return result;
    }

    if (doc.kind && doc.kind !== "Secret") {
      result.valid = false;
      result.errors.push({ message: `Resource kind is '${doc.kind}', expected 'Secret'.` });
      return result;
    }

    if (doc.kind === "Secret") {
      if (!doc.metadata?.name) {
        result.valid = false;
        result.errors.push({ message: "Kubernetes Secret missing required 'metadata.name' property." });
      }

      if (doc.data && typeof doc.data === "object") {
        Object.entries(doc.data).forEach(([key, val]) => {
          const valStr = String(val || "");
          if (valStr && !isValidBase64(valStr)) {
            const lineIdx = lines.findIndex((l) => l.includes(`${key}:`));
            result.valid = false;
            result.errors.push({
              key,
              line: lineIdx >= 0 ? lineIdx + 1 : undefined,
              message: `Key '${key}' contains malformed Base64 string value.`,
            });
          }
        });
      }
    }
  } catch (err: any) {
    result.valid = false;
    result.errors.push({ message: err.message || "Failed to parse YAML manifest." });
  }

  return result;
}

export function transformKubernetesSecret(
  yamlStr: string,
  mode: "encode" | "decode"
): string {
  if (!yamlStr || !yamlStr.trim()) return yamlStr;

  try {
    const doc = YAML.parseDocument(yamlStr);
    const contents = doc.contents as any;
    if (!contents || typeof contents.get !== "function") return yamlStr;

    const kind = contents.get("kind");
    if (kind !== "Secret") return yamlStr;

    if (mode === "decode") {
      const dataNode = contents.get("data");
      if (dataNode && typeof dataNode.get === "function") {
        const dataMap = dataNode.toJSON() || {};
        const decodedMap: Record<string, string> = {};

        Object.entries(dataMap).forEach(([k, val]) => {
          const valStr = String(val || "");
          if (isValidBase64(valStr)) {
            try {
              decodedMap[k] = atob(valStr);
            } catch {
              decodedMap[k] = valStr;
            }
          } else {
            decodedMap[k] = valStr;
          }
        });

        contents.delete("data");
        contents.set("stringData", decodedMap);
      }
    } else if (mode === "encode") {
      const stringDataNode = contents.get("stringData");
      const dataNode = contents.get("data");

      const encodedMap: Record<string, string> = {};

      if (stringDataNode && typeof stringDataNode.toJSON === "function") {
        const stringMap = stringDataNode.toJSON() || {};
        Object.entries(stringMap).forEach(([k, val]) => {
          encodedMap[k] = btoa(String(val || ""));
        });
        contents.delete("stringData");
      }

      if (dataNode && typeof dataNode.toJSON === "function") {
        const dataMap = dataNode.toJSON() || {};
        Object.entries(dataMap).forEach(([k, val]) => {
          const valStr = String(val || "");
          encodedMap[k] = isValidBase64(valStr) ? valStr : btoa(valStr);
        });
      }

      contents.set("data", encodedMap);
    }

    return doc.toString();
  } catch {
    return yamlStr;
  }
}

export function getSecretTransformationDetails(
  originalYaml: string,
  mode: "encode" | "decode" | "format"
): SecretTransformationSummary {
  const details: SecretKeyTransformationDetail[] = [];
  try {
    const origDoc = YAML.parse(originalYaml);
    if (!origDoc || typeof origDoc !== "object" || origDoc.kind !== "Secret") {
      return { detectedCount: 0, transformedCount: 0, unchangedCount: 0, details: [] };
    }

    const dataObj = origDoc.data && typeof origDoc.data === "object" ? origDoc.data : {};
    const stringDataObj = origDoc.stringData && typeof origDoc.stringData === "object" ? origDoc.stringData : {};

    const allKeys = Array.from(new Set([...Object.keys(dataObj), ...Object.keys(stringDataObj)]));

    allKeys.forEach((k) => {
      const isInData = k in dataObj;
      const val = String(dataObj[k] || stringDataObj[k] || "");

      if (mode === "decode") {
        if (isInData && isValidBase64(val)) {
          details.push({ key: k, from: "Base64", to: "Plaintext", transformed: true });
        } else {
          details.push({ key: k, from: "Plaintext", to: "Plaintext", transformed: false });
        }
      } else {
        if (!isInData || !isValidBase64(val)) {
          details.push({ key: k, from: "Plaintext", to: "Base64", transformed: true });
        } else {
          details.push({ key: k, from: "Base64", to: "Base64", transformed: false });
        }
      }
    });
  } catch {}

  const transformedCount = details.filter((d) => d.transformed).length;
  const unchangedCount = details.length - transformedCount;

  return {
    detectedCount: details.length,
    transformedCount,
    unchangedCount,
    details,
  };
}

export function convertStringDataToData(yamlStr: string): string {
  return transformKubernetesSecret(yamlStr, "encode");
}
