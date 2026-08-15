"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import AppModal from "@/components/ui/AppModal";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useUploadMedia } from "@/hooks/useMedia";
import { formatBytes } from "./MediaCard";
import Image from "next/image";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export default function UploadModal({ isOpen, onClose, onSuccess }: Readonly<UploadModalProps>) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = useUploadMedia();

    const handleFileSelect = (file: File) => {
        setErrorMsg(null);
        if (!ALLOWED_TYPES.includes(file.type)) {
            setErrorMsg("Unsupported file type. Please upload JPG, PNG, WebP, GIF, or SVG.");
            return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setErrorMsg(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        handleRemoveFile();
        onClose();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setErrorMsg(null);
        try {
            await uploadMutation.mutateAsync(selectedFile);
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to upload media. Please try again.";
            setErrorMsg(message);
        }
    };

    return (
        <AppModal open={isOpen} onClose={handleClose} title="Upload Media">
            <div className="space-y-4">
                {errorMsg && (
                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {!selectedFile ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-3 ${
                            isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleInputChange}
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                            className="hidden"
                        />
                        <div className="p-3 bg-muted rounded-full text-muted-foreground">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                SVG, PNG, JPG, WebP, or GIF (max 5MB)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="border border-border rounded-xl p-4 bg-card space-y-3">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="truncate pr-2">
                                <p className="text-sm font-semibold truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(selectedFile.size)}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={handleRemoveFile}
                                disabled={uploadMutation.isPending}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={uploadMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                    >
                        {uploadMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Upload
                    </Button>
                </div>
            </div>
        </AppModal>
    );
}
