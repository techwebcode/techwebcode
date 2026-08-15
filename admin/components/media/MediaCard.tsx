"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileImage } from "lucide-react";
import { Media } from "@/types/media";

interface MediaCardProps {
    media: Media;
    onViewDetails: (media: Media) => void;
}

export function formatBytes(bytes: number, decimals = 1): string {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

export function getMediaUrl(url: string | undefined): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";
    try {
        const origin = new URL(apiBase).origin;
        return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
    } catch {
        return url;
    }
}

export default function MediaCard({ media, onViewDetails }: Readonly<MediaCardProps>) {
    const fileType = (media.mime_type || media.extension || "image")
        .replace("image/", "")
        .toUpperCase();

    const dimensions =
        media.width && media.height ? `${media.width} × ${media.height}` : null;

    const displayUrl = getMediaUrl(media.url);

    return (
        <Card className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md flex flex-col justify-between">
            <div className="relative aspect-video w-full overflow-hidden bg-muted/30 flex items-center justify-center">
                {displayUrl ? (
                    <Image
                        src={displayUrl}
                        alt={media.alt_text || media.original_name || media.file_name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                    />
                ) : (
                    <FileImage className="h-10 w-10 text-muted-foreground" />
                )}
            </div>

            <CardContent className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                    <h4
                        className="font-semibold text-sm text-foreground truncate"
                        title={media.original_name || media.file_name}
                    >
                        {media.original_name || media.file_name}
                    </h4>

                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">{fileType}</span>
                        {dimensions && ` • ${dimensions}`}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatBytes(media.file_size)}</span>
                        <span>{formatDate(media.created_at)}</span>
                    </div>
                </div>

                <div className="pt-2 border-t mt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium"
                        onClick={() => onViewDetails(media)}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        View
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
