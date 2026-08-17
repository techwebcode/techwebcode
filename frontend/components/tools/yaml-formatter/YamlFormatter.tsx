"use client";

import React from "react";
import { Tool } from "@/types/tools";
import KubernetesSecretWorkspace from "./KubernetesSecretWorkspace";

interface Props {
  readonly tool: Tool;
}

export default function YamlFormatter({ tool }: Props) {
  return <KubernetesSecretWorkspace tool={tool} />;
}
