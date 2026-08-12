import YAML from "yaml";

export function formatYaml(value: string, indent = 2): string {
  if (!value.trim()) return "";
  const doc = YAML.parse(value);
  return YAML.stringify(doc, { indent });
}

export function validateYaml(value: string): { valid: boolean; error?: string } {
  if (!value.trim()) {
    return { valid: false };
  }
  try {
    YAML.parse(value);
    return { valid: true };
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}

/**
 * Base64 Helper utilities supporting UTF-8 strings
 */
function safeBase64Decode(str: string): string {
  try {
    const trimmed = str.trim().replace(/^["']|["']$/g, "");
    // Check if string looks like valid Base64
    if (!/^[A-Za-z0-9+/=]+$/.test(trimmed) || trimmed.length % 4 !== 0) {
      return str; // Return original if not valid base64
    }
    const decoded = atob(trimmed);
    // Check if decoded string contains readable characters
    if (/[\x00-\x08\x0E-\x1F]/.test(decoded)) {
      return str; // Binary data, keep as is
    }
    return decoded;
  } catch {
    return str;
  }
}

function safeBase64Encode(str: string): string {
  try {
    const trimmed = str.trim().replace(/^["']|["']$/g, "");
    return btoa(unescape(encodeURIComponent(trimmed)));
  } catch {
    return str;
  }
}

/**
 * Kubernetes Secret Base64 Decoder
 * Decodes all Base64 values under `data:` or key-value pairs.
 */
export function decodeK8sSecrets(value: string): string {
  if (!value.trim()) return "";

  try {
    const parsed = YAML.parse(value);

    // If structured K8s Secret with data object
    if (parsed && typeof parsed === "object") {
      const copy = JSON.parse(JSON.stringify(parsed));

      if (copy.data && typeof copy.data === "object") {
        for (const key of Object.keys(copy.data)) {
          if (typeof copy.data[key] === "string") {
            copy.data[key] = safeBase64Decode(copy.data[key]);
          }
        }
        return YAML.stringify(copy, { indent: 2 });
      }

      // If flat object, decode all string values
      let hasDecoded = false;
      for (const key of Object.keys(copy)) {
        if (typeof copy[key] === "string") {
          const decoded = safeBase64Decode(copy[key]);
          if (decoded !== copy[key]) {
            copy[key] = decoded;
            hasDecoded = true;
          }
        }
      }
      if (hasDecoded) {
        return YAML.stringify(copy, { indent: 2 });
      }
    }
  } catch {
    // Fallback regex line parser if full YAML parse fails
  }

  // Regex fallback line parser
  const lines = value.split("\n");
  const processed = lines.map((line) => {
    const match = line.match(/^(\s*)([a-zA-Z0-9_$.-]+)\s*:\s*(.+)$/);
    if (match) {
      const [, indentStr, key, val] = match;
      const decoded = safeBase64Decode(val.trim());
      return `${indentStr}${key}: ${decoded}`;
    }
    return line;
  });

  return processed.join("\n");
}

/**
 * Kubernetes Secret Base64 Encoder
 * Encodes all values under `data:` or key-value pairs into Base64 strings.
 */
export function encodeK8sSecrets(value: string): string {
  if (!value.trim()) return "";

  try {
    const parsed = YAML.parse(value);

    if (parsed && typeof parsed === "object") {
      const copy = JSON.parse(JSON.stringify(parsed));

      if (copy.data && typeof copy.data === "object") {
        for (const key of Object.keys(copy.data)) {
          if (typeof copy.data[key] === "string") {
            copy.data[key] = safeBase64Encode(copy.data[key]);
          }
        }
        return YAML.stringify(copy, { indent: 2 });
      }

      // If flat object, encode string values
      for (const key of Object.keys(copy)) {
        if (typeof copy[key] === "string") {
          copy[key] = safeBase64Encode(copy[key]);
        }
      }
      return YAML.stringify(copy, { indent: 2 });
    }
  } catch {
    // Fallback regex line parser
  }

  const lines = value.split("\n");
  const processed = lines.map((line) => {
    const match = line.match(/^(\s*)([a-zA-Z0-9_$.-]+)\s*:\s*(.+)$/);
    if (match) {
      const [, indentStr, key, val] = match;
      const encoded = safeBase64Encode(val.trim());
      return `${indentStr}${key}: ${encoded}`;
    }
    return line;
  });

  return processed.join("\n");
}

/**
 * Convert YAML to JSON string
 */
export function yamlToJson(value: string): string {
  if (!value.trim()) return "";
  const parsed = YAML.parse(value);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Convert JSON to YAML string
 */
export function jsonToYaml(value: string): string {
  if (!value.trim()) return "";
  const parsed = JSON.parse(value);
  return YAML.stringify(parsed, { indent: 2 });
}

export function downloadYamlFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".yaml") || filename.endsWith(".yml") ? filename : `${filename}.yaml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getYamlStats(value: string): { bytes: number; keysCount: number; isK8sSecret: boolean } {
  if (!value.trim()) {
    return { bytes: 0, keysCount: 0, isK8sSecret: false };
  }
  try {
    const parsed = YAML.parse(value);
    const bytes = new Blob([value]).size;
    let keysCount = 0;
    let isK8sSecret = false;

    if (parsed && typeof parsed === "object") {
      if (parsed.kind === "Secret" || parsed.data) {
        isK8sSecret = true;
      }
      const countKeys = (obj: unknown) => {
        if (typeof obj === "object" && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach(countKeys);
          } else {
            const record = obj as Record<string, unknown>;
            const keys = Object.keys(record);
            keysCount += keys.length;
            keys.forEach((k) => countKeys(record[k]));
          }
        }
      };
      countKeys(parsed);
    }
    return { bytes, keysCount, isK8sSecret };
  } catch {
    return { bytes: new Blob([value]).size, keysCount: 0, isK8sSecret: false };
  }
}
