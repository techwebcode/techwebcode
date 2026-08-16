import JSZip from "jszip";
import { ConfigFileType, ProjectFile } from "./types";

/**
 * Classifies a configuration file automatically based on name and content.
 */
export function classifyFileType(filename: string, content: string): ConfigFileType {
  const lowerName = filename.toLowerCase();

  if (lowerName.includes(".env") || lowerName.endsWith(".env") || lowerName.startsWith(".env.")) {
    return "env";
  }

  if (
    lowerName.includes("docker-compose") ||
    lowerName === "compose.yml" ||
    lowerName === "compose.yaml"
  ) {
    return "docker-compose";
  }

  if (lowerName.includes("dockerfile") || lowerName.endsWith(".dockerfile")) {
    return "dockerfile";
  }

  if (lowerName.endsWith("nginx.conf") || lowerName.endsWith(".nginx")) {
    return "nginx";
  }

  if (lowerName.startsWith("next.config.") || lowerName === "next.config.js" || lowerName === "next.config.mjs") {
    return "next-config";
  }

  if (lowerName === "package.json") {
    return "package-json";
  }

  if (lowerName === "tsconfig.json") {
    return "tsconfig";
  }

  if (lowerName.includes(".github/workflows") || lowerName.includes("workflow")) {
    return "github-actions";
  }

  // Check if YAML content defines Kubernetes resources
  if (lowerName.endsWith(".yaml") || lowerName.endsWith(".yml")) {
    if (
      content.includes("kind: Deployment") ||
      content.includes("kind: Service") ||
      content.includes("kind: ConfigMap") ||
      content.includes("kind: Secret") ||
      content.includes("kind: Ingress") ||
      content.includes("kind: StatefulSet") ||
      content.includes("kind: DaemonSet") ||
      content.includes("kind: Job") ||
      content.includes("kind: CronJob") ||
      content.includes("kind: PersistentVolume")
    ) {
      return "kubernetes";
    }
  }

  return "unknown";
}

/**
 * Reads uploaded files (or zip archives) and converts them into normalized ProjectFiles.
 */
export async function parseUploadedInput(files: FileList | File[]): Promise<ProjectFile[]> {
  const result: ProjectFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Handle ZIP files
    if (file.name.endsWith(".zip")) {
      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);

        for (const relativePath of Object.keys(zipContent.files)) {
          const zipEntry = zipContent.files[relativePath];
          if (zipEntry.dir) continue;

          // Skip binary or node_modules
          if (
            relativePath.includes("node_modules/") ||
            relativePath.includes(".git/") ||
            relativePath.includes(".next/")
          ) {
            continue;
          }

          const content = await zipEntry.async("string");
          const type = classifyFileType(relativePath, content);

          if (type !== "unknown") {
            result.push({
              path: relativePath,
              name: zipEntry.name.split("/").pop() || zipEntry.name,
              type,
              content,
              lines: content.split("\n"),
            });
          }
        }
      } catch (err) {
        console.error("Failed to parse ZIP archive:", err);
      }
    } else {
      // Handle individual or multiple selected files
      try {
        const content = await file.text();
        const path = (file as any).webkitRelativePath || file.name;
        const type = classifyFileType(path, content);

        result.push({
          path,
          name: file.name,
          type,
          content,
          lines: content.split("\n"),
        });
      } catch (err) {
        console.error(`Failed to read file ${file.name}:`, err);
      }
    }
  }

  return result;
}
