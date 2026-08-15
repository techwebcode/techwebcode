"use client";

import { useState, useEffect } from "react";
import AppModal from "@/components/ui/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Save, ExternalLink, Loader2, AlertCircle, FileImage } from "lucide-react";
import { Media } from "@/types/media";
import { useUpdateMediaAltText, useDeleteMedia } from "@/hooks/useMedia";
import { formatBytes, formatDate, getMediaUrl } from "./MediaCard";
import { toast } from "sonner";
import Image from "next/image";

interface MediaDetailsModalProps {
    media: Media | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleted?: () => void;
}

export default function MediaDetailsModal({
    media,
    isOpen,
    onClose,
    onDeleted,
}: Readonly<MediaDetailsModalProps>) {
    const [altText, setAltText] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const updateAltMutation = useUpdateMediaAltText();
    const deleteMutation = useDeleteMedia();

    useEffect(() => {
        if (media) {
            setAltText(media.alt_text || "");
            setConfirmDelete(false);
            setErrorMsg(null);
        }
    }, [media]);

    if (!media) return null;

    const displayUrl = getMediaUrl(media.url);
    const fullPublicUrl = displayUrl;

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(fullPublicUrl);
            toast.success("Media URL copied.");
        } catch {
            toast.error("Failed to copy URL.");
        }
    };

    const handleSaveAltText = async () => {
        try {
            await updateAltMutation.mutateAsync({
                id: media.id,
                altText,
            });
            toast.success("Alt text updated.");
        } catch {
            toast.error("Failed to update alt text.");
        }
    };

    const handleDelete = async () => {
        setErrorMsg(null);
        try {
            await deleteMutation.mutateAsync(media.id);
            toast.success("Media deleted.");
            onClose();
            if (onDeleted) onDeleted();
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete media.";
            setErrorMsg(message);
            toast.error(message);
        }
    };

    const fileType = (media.mime_type || media.extension || "image")
        .replace("image/", "")
        .toUpperCase();

    const dimensions =
        media.width && media.height ? `${media.width} × ${media.height}` : "Unknown";

    return (
        <AppModal open={isOpen} onClose={onClose} title="Media Details">
            <div className="space-y-6">
                {errorMsg && (
                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Preview Banner */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30 flex items-center justify-center">
                    {displayUrl ? (
                        <Image
                            src={displayUrl}
                            alt={media.alt_text || media.original_name || media.file_name}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    ) : (
                        <FileImage className="h-12 w-12 text-muted-foreground" />
                    )}
                </div>

                {/* File Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-border">
                    <div>
                        <span className="text-xs text-muted-foreground block">Filename</span>
                        <span className="font-medium text-foreground truncate block" title={media.file_name}>
                            {media.file_name}
                        </span>
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground block">Original Filename</span>
                        <span className="font-medium text-foreground truncate block" title={media.original_name}>
                            {media.original_name || "—"}
                        </span>
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground block">MIME Type</span>
                        <span className="font-medium text-foreground">{media.mime_type || fileType}</span>
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground block">Dimensions</span>
                        <span className="font-medium text-foreground">{dimensions}</span>
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground block">File Size</span>
                        <span className="font-medium text-foreground">{formatBytes(media.file_size)}</span>
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground block">Uploaded Date</span>
                        <span className="font-medium text-foreground">{formatDate(media.created_at)}</span>
                    </div>
                </div>

                {/* Public URL Field */}
                <div className="space-y-1.5">
                    <Label htmlFor="public-url" className="text-xs font-semibold">Public URL</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="public-url"
                            value={fullPublicUrl}
                            readOnly
                            className="bg-muted text-xs font-mono text-muted-foreground"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCopyUrl}
                            className="shrink-0 flex items-center gap-1.5"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            Copy URL
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Open URL in new tab"
                            onClick={() => window.open(media.url, "_blank")}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Editable Alt Text */}
                <div className="space-y-1.5">
                    <Label htmlFor="alt-text" className="text-xs font-semibold">Alt Text</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="alt-text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe this image for SEO and accessibility..."
                            className="text-sm"
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSaveAltText}
                            disabled={updateAltMutation.isPending}
                            className="shrink-0 flex items-center gap-1.5"
                        >
                            {updateAltMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            Save
                        </Button>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t flex items-center justify-between">
                    {!confirmDelete ? (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-1.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Media
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-destructive">Confirm Delete?</span>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                ) : null}
                                Yes, Delete
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}

                    <Button type="button" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </AppModal>
    );
}
