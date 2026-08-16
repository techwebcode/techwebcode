import React from "react";
import { Tool } from "@/types/tools";

import JsonFormatter from "@/components/tools/json-formatter/JsonFormatter";
import JsonValidator from "@/components/tools/json-validator/JsonValidator";
import JsonMinifier from "@/components/tools/json-minifier/JsonMinifier";
import JwtDecoder from "@/components/tools/jwt-decoder/JwtDecoder";
import Base64Tool from "@/components/tools/base64/Base64Tool";
import UuidGenerator from "@/components/tools/uuid-generator/UuidGenerator";
import TimestampConverter from "@/components/tools/timestamp-converter/TimestampConverter";
import UrlEncoder from "@/components/tools/url-encoder/UrlEncoder";
import RegexTester from "@/components/tools/regex-tester/RegexTester";
import SqlFormatter from "@/components/tools/sql-formatter/SqlFormatter";
import YamlFormatter from "@/components/tools/yaml-formatter/YamlFormatter";
import DeploymentConfigDoctor from "@/components/tools/deployment-config-doctor/DeploymentConfigDoctor";
import ApiContractChecker from "@/components/tools/api-contract-checker/ApiContractChecker";

export type ToolComponent = React.ComponentType<{ tool: Tool }>;

export const TOOL_REGISTRY: Record<string, ToolComponent> = {
  "json-formatter": JsonFormatter,
  "json-validator": JsonValidator,
  "json-minifier": JsonMinifier,
  "jwt-decoder": JwtDecoder,
  "base64": Base64Tool,
  "base64-encoder": Base64Tool,
  "base64-decoder": Base64Tool,
  "base64-encoder-decoder": Base64Tool,
  "base64-encoder-and-decoder": Base64Tool,
  "uuid-generator": UuidGenerator,
  "uuid-guid-generator": UuidGenerator,
  "timestamp-converter": TimestampConverter,
  "unix-timestamp-converter": TimestampConverter,
  "url-encoder": UrlEncoder,
  "url-decoder": UrlEncoder,
  "url-encoder-decoder": UrlEncoder,
  "url-encoder-and-decoder": UrlEncoder,
  "regex-tester": RegexTester,
  "regex-pattern-tester": RegexTester,
  "sql-formatter": SqlFormatter,
  "sql-query-formatter": SqlFormatter,
  "yaml-formatter": YamlFormatter,
  "yaml-formatter-and-kubernetes-secret-tool": YamlFormatter,
  "yaml-formatter-and-k8s-secret-tool": YamlFormatter,
  "yaml-validator": YamlFormatter,
  "k8s-secret-tool": YamlFormatter,
  "kubernetes-secret-generator": YamlFormatter,
  "kubernetes-secret-tool": YamlFormatter,
  "deployment-config-doctor": DeploymentConfigDoctor,
  "api-contract-checker": ApiContractChecker,
  "api-contract-and-response-compatibility-checker": ApiContractChecker,
};

export function getToolComponent(slug: string): ToolComponent | null {
  const normalizedSlug = slug.toLowerCase().trim();
  return TOOL_REGISTRY[normalizedSlug] || null;
}
