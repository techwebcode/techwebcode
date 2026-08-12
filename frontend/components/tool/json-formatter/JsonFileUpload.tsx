"use client";

import { Upload } from "lucide-react";
import { ChangeEvent, useRef } from "react";

import { Button } from "@/components/ui/button";

interface JsonFileUploadProps {
  onLoad: (content: string) => void;
}

export default function JsonFileUpload({
  onLoad,
}: JsonFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
        accept=".json,application/json"
        onChange={handleFile}
      />

      <Button
        variant="outline"
        onClick={openPicker}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload JSON
      </Button>
    </>
  );
}