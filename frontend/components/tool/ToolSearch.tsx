"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ToolSearchProps {
  value?: string;
  onSearch?: (term: string) => void;
}

export default function ToolSearch({ value, onSearch }: ToolSearchProps) {
  return (
    <div className="relative max-w-xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="text"
        value={value}
        onChange={(e) => onSearch?.(e.target.value)}
        placeholder="Search developer tools (e.g. json, jwt, base64, uuid)..."
        className="pl-10 h-10 text-xs bg-card"
      />
    </div>
  );
}