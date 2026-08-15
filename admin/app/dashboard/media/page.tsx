"use client";

import { useState } from "react";
import AppCard from "@/components/ui/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Image as ImageIcon, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaList } from "@/hooks/useMedia";
import { Media } from "@/types/media";
import MediaCard from "@/components/media/MediaCard";
import UploadModal from "@/components/media/UploadModal";
import MediaDetailsModal from "@/components/media/MediaDetailsModal";

export default function MediaLibraryPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const limit = 24;
    const { data, isLoading, isError, refetch } = useMediaList(page, limit, search);

    const mediaResponse = data?.data;
    const items = mediaResponse?.items ?? [];
    const pagination = mediaResponse?.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleViewDetails = (media: Media) => {
        setSelectedMedia(media);
        setDetailsOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage, upload, inspect, and organize image assets for TechWebCode.
                    </p>
                </div>
                <Button onClick={() => setUploadOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} />
                    Upload Media
                </Button>
            </div>

            <AppCard>
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search media by filename..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9 text-sm"
                        />
                    </div>
                </div>

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="border border-border rounded-xl p-4 space-y-3 animate-pulse">
                                <div className="aspect-video w-full bg-muted rounded-lg" />
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="py-12 text-center space-y-3 border border-border rounded-xl bg-card">
                        <p className="text-sm text-destructive font-medium">
                            Unable to load media. Please try again.
                        </p>
                        <Button variant="outline" size="sm" onClick={() => refetch()} className="flex items-center gap-1.5 mx-auto">
                            <RotateCcw className="h-4 w-4" />
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && items.length === 0 && (
                    <div className="py-16 text-center space-y-4 border border-dashed border-border rounded-xl bg-card">
                        <div className="p-4 bg-muted inline-block rounded-full text-muted-foreground">
                            <ImageIcon className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-foreground">No media yet</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Upload your first image to use it across TechWebCode articles and developer tools.
                            </p>
                        </div>
                        <Button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 mx-auto">
                            <Plus size={16} />
                            Upload Media
                        </Button>
                    </div>
                )}

                {/* Media Grid */}
                {!isLoading && !isError && items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((media) => (
                            <MediaCard
                                key={media.id}
                                media={media}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !isError && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t mt-6">
                        <p className="text-xs text-muted-foreground">
                            Showing page <span className="font-semibold text-foreground">{page}</span> of{" "}
                            <span className="font-semibold text-foreground">{totalPages}</span> ({pagination?.total} items)
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 text-xs"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page >= totalPages}
                                className="flex items-center gap-1 text-xs"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </AppCard>

            {/* Modals */}
            <UploadModal
                isOpen={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onSuccess={() => refetch()}
            />

            <MediaDetailsModal
                media={selectedMedia}
                isOpen={detailsOpen}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedMedia(null);
                }}
                onDeleted={() => refetch()}
            />
        </div>
    );
}
