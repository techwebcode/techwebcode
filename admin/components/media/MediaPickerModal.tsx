"use client";

import { useState } from "react";
import AppModal from "@/components/ui/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Check, Image as ImageIcon, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMediaList } from "@/hooks/useMedia";
import { Media } from "@/types/media";
import UploadModal from "./UploadModal";
import Image from "next/image";

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
    selectedMediaId?: number | null;
}

export default function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    selectedMediaId,
}: Readonly<MediaPickerModalProps>) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Media | null>(null);

    const limit = 12;
    const { data, isLoading, isError, refetch } = useMediaList(page, limit, search);

    const mediaResponse = data?.data;
    const items = mediaResponse?.items ?? [];
    const pagination = mediaResponse?.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleItemClick = (media: Media) => {
        setSelectedItem(media);
    };

    const handleConfirmSelection = () => {
        if (selectedItem) {
            onSelect(selectedItem);
            onClose();
        }
    };

    const handleUploadSuccess = (createdMedia?: Media) => {
        refetch();
        if (createdMedia) {
            onSelect(createdMedia);
            onClose();
        }
    };

    return (
        <>
            <AppModal open={isOpen} onClose={onClose} title="Select Featured Image">
                <div className="space-y-4">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search images..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-9 text-sm"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadOpen(true)}
                            className="flex items-center gap-1.5 w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Upload New Image
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="aspect-square bg-muted rounded-lg animate-pulse" />
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="py-8 text-center space-y-2 border border-border rounded-xl">
                            <p className="text-sm text-destructive font-medium">Failed to load media items.</p>
                            <Button variant="outline" size="sm" onClick={() => refetch()} className="flex items-center gap-1 mx-auto">
                                <RotateCcw className="h-3.5 w-3.5" />
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && items.length === 0 && (
                        <div className="py-12 text-center space-y-3 border border-dashed border-border rounded-xl">
                            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm font-medium">No images found</p>
                            <Button size="sm" onClick={() => setUploadOpen(true)} className="flex items-center gap-1.5 mx-auto">
                                <Plus className="h-4 w-4" />
                                Upload Image
                            </Button>
                        </div>
                    )}

                    {/* Media Grid */}
                    {!isLoading && !isError && items.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1">
                            {items.map((media) => {
                                const isSelected =
                                    selectedItem?.id === media.id ||
                                    (!selectedItem && selectedMediaId === media.id);

                                return (
                                    <div
                                        key={media.id}
                                        onClick={() => handleItemClick(media)}
                                        className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                                            isSelected
                                                ? "border-primary ring-2 ring-primary/20 shadow-md"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <Image
                                            src={media.url}
                                            alt={media.alt_text || media.file_name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                            unoptimized
                                        />

                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full shadow">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[11px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {media.original_name || media.file_name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination & Actions Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                            {totalPages > 1 && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button type="button" variant="outline" size="sm" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                disabled={!selectedItem}
                                onClick={handleConfirmSelection}
                            >
                                Use Selected Image
                            </Button>
                        </div>
                    </div>
                </div>
            </AppModal>

            <UploadModal
                isOpen={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </>
    );
}
