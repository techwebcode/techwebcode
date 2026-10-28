"use client";

import React from "react";
import { Tool } from "@/types/tools";
import ToolHeader from "@/components/tool/ToolHeader";
import KubernetesSecretWorkspace from "./KubernetesSecretWorkspace";

interface Props {
  readonly tool: Tool;
}

export default function YamlFormatter({ tool }: Props) {
  return (
    <div className="space-y-6 w-full">
      <ToolHeader tool={tool} />
      <KubernetesSecretWorkspace tool={tool} />
    </div>
  );
}
