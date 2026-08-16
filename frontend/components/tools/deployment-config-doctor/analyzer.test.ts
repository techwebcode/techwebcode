import { runAnalyzerEngine } from "./engine";
import { ProjectFile } from "./types";
import { maskSecretValue } from "./analyzers/envAnalyzer";

describe("Deployment Config Doctor - Part 2 Analyzers", () => {
  test("Secret value masking masks sensitive text", () => {
    expect(maskSecretValue("super_secret_password_123")).toBe("••••••••••");
  });

  test("Detects missing env variables between .env and .env.example", () => {
    const files: ProjectFile[] = [
      {
        path: ".env.example",
        name: ".env.example",
        type: "env",
        content: "API_URL=http://localhost:8080\nADMIN_SECRET=your_secret_here\nDATABASE_URL=mysql://...",
        lines: ["API_URL=http://localhost:8080", "ADMIN_SECRET=your_secret_here", "DATABASE_URL=mysql://..."],
      },
      {
        path: ".env",
        name: ".env",
        type: "env",
        content: "API_URL=http://localhost:8080",
        lines: ["API_URL=http://localhost:8080"],
      },
    ];

    const report = runAnalyzerEngine(files);
    const missingFinding = report.findings.find((f) => f.ruleId === "ENV-001");
    expect(missingFinding).toBeDefined();
    expect(missingFinding?.title).toContain("ADMIN_SECRET");
  });

  test("Detects localhost container networking issue in docker-compose.yml", () => {
    const files: ProjectFile[] = [
      {
        path: "docker-compose.yml",
        name: "docker-compose.yml",
        type: "docker-compose",
        content: "services:\n  frontend:\n    environment:\n      - API_URL=http://localhost:8080/api",
        lines: [
          "services:",
          "  frontend:",
          "    environment:",
          "      - API_URL=http://localhost:8080/api",
        ],
      },
    ];

    const report = runAnalyzerEngine(files);
    const localhostFinding = report.findings.find((f) => f.ruleId === "CMP-001");
    expect(localhostFinding).toBeDefined();
    expect(localhostFinding?.severity).toBe("error");
  });

  test("Detects unpinned :latest Docker base image tag", () => {
    const files: ProjectFile[] = [
      {
        path: "Dockerfile",
        name: "Dockerfile",
        type: "dockerfile",
        content: "FROM node:latest\nWORKDIR /app\nCOPY . .\nCMD ['npm', 'start']",
        lines: ["FROM node:latest", "WORKDIR /app", "COPY . .", "CMD ['npm', 'start']"],
      },
    ];

    const report = runAnalyzerEngine(files);
    const unpinnedFinding = report.findings.find((f) => f.ruleId === "DOC-001");
    expect(unpinnedFinding).toBeDefined();
    expect(unpinnedFinding?.severity).toBe("warning");
  });
});
