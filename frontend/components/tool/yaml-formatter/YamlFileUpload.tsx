"use client";

import { Upload } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";

interface YamlFileUploadProps {
  onLoad: (content: string) => void;
}

export default function YamlFileUpload({ onLoad }: YamlFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    onLoad(text);
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".yaml,.yml,text/yaml"
        onChange={handleFile}
      />

      <Button variant="outline" size="sm" onClick={openPicker} className="rounded-xl gap-1.5 text-xs">
        <Upload className="h-3.5 w-3.5" />
        Upload YAML
      </Button>
    </>
  );
}
