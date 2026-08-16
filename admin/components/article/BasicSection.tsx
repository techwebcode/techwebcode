"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, RefreshCw, Trash2, Image as ImageIcon } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCategoryOptions } from "@/hooks/useCategories";
import { useTagOptions } from "@/hooks/useTags";
import { useToolOptions } from "@/hooks/useTools";
import MediaPickerModal from "@/components/media/MediaPickerModal";
import { Media } from "@/types/media";

interface BasicSectionProps {
    onSlugManualEdit?: () => void;
}

export default function BasicSection({ onSlugManualEdit }: Readonly<BasicSectionProps> = {}) {

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const { data: categoryOptions } = useCategoryOptions();
    const { data: tagOptions } = useTagOptions();
    const { data: toolOptions } = useToolOptions();

    const [pickerOpen, setPickerOpen] = useState(false);

    const featuredImageId = watch("featured_image_id");
    const featuredImage = watch("featured_image");

    const selectedTags: number[] = watch("tag_ids") ?? [];

    const toggleTag = (id: number) => {
        if (selectedTags.includes(id)) {
            setValue(
                "tag_ids",
                selectedTags.filter((tagId) => tagId !== id),
                { shouldValidate: true, shouldDirty: true }
            );
            return;
        }

        setValue(
            "tag_ids",
            [...selectedTags, id],
            { shouldValidate: true, shouldDirty: true }
        );
    };

    const handleSelectMedia = (media: Media) => {
        setValue("featured_image_id", media.id, { shouldValidate: true, shouldDirty: true });
        setValue("featured_image", media.url, { shouldValidate: true, shouldDirty: true });
    };

    const handleRemoveImage = () => {
        setValue("featured_image_id", null, { shouldValidate: true, shouldDirty: true });
        setValue("featured_image", "", { shouldValidate: true, shouldDirty: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Basic Information
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* Title */}
                <div>
                    <Label>Title</Label>
                    <Input
                        placeholder="Go Tutorial for Beginners"
                        {...register("title")}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {String(errors.title.message)}
                        </p>
                    )}
                </div>

                {/* Slug */}
                <div>
                    <Label>Slug</Label>
                    <Input
                        placeholder="go-tutorial-for-beginners"
                        {...register("slug", {
                            onChange: () => onSlugManualEdit?.(),
                        })}
                    />
                    {errors.slug && (
                        <p className="mt-1 text-sm text-red-500">
                            {String(errors.slug.message)}
                        </p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <Label htmlFor="category_id">
                        Category <span className="text-destructive">*</span>
                    </Label>

                    {(() => {
                        const activeCategoryId = watch("category_id");
                        const selectedCategoryName = categoryOptions?.find(
                            (c) => String(c.id) === String(activeCategoryId)
                        )?.name;

                        return (
                            <Select
                                value={activeCategoryId ? String(activeCategoryId) : undefined}
                                onValueChange={(value) =>
                                    setValue(
                                        "category_id",
                                        Number(value),
                                        { shouldValidate: true }
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Category">
                                        {selectedCategoryName || "Select Category"}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {categoryOptions?.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })()}

                    {errors.category_id && (
                        <p className="mt-1 text-sm text-destructive font-medium">
                            {String(errors.category_id.message)}
                        </p>
                    )}
                </div>

                {/* Primary Tool */}
                <div>
                    <Label htmlFor="primary_tool_id">
                        Primary Tool
                    </Label>

                    {(() => {
                        const activeToolId = watch("primary_tool_id");
                        const selectedTool = toolOptions?.find(
                            (t) => String(t.id) === String(activeToolId)
                        );

                        return (
                            <Select
                                value={activeToolId ? String(activeToolId) : "none"}
                                onValueChange={(value) => {
                                    if (value === "none" || !value) {
                                        setValue("primary_tool_id", null, { shouldValidate: true, shouldDirty: true });
                                    } else {
                                        setValue("primary_tool_id", Number(value), { shouldValidate: true, shouldDirty: true });
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Primary Tool">
                                        {selectedTool ? selectedTool.name : "None"}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">
                                        None
                                    </SelectItem>

                                    {toolOptions?.map((tool) => (
                                        <SelectItem
                                            key={tool.id}
                                            value={String(tool.id)}
                                        >
                                            {tool.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })()}
                </div>

                {/* Tags */}
                <div>
                    <Label>Tags</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(tagOptions ?? []).map((tag: any) => (
                            <button
                                type="button"
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={`rounded-full border px-4 py-2 text-sm transition ${
                                    selectedTags.includes(tag.id)
                                        ? "bg-primary text-white"
                                        : "bg-background"
                                }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Image Section */}
                <div className="space-y-2">
                    <Label>Featured Image</Label>

                    {featuredImage ? (
                        <div className="border border-border rounded-xl p-4 bg-card space-y-3">
                            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                                <img
                                    src={featuredImage}
                                    alt="Featured Image Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPickerOpen(true)}
                                    className="flex items-center gap-1.5"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Change Image
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    className="flex items-center gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove Image
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-3 bg-muted/20 hover:border-primary/50 transition-colors">
                            <div className="p-3 bg-muted inline-block rounded-full text-muted-foreground">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">No featured image selected</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Choose an image from the Media Library to represent this article.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPickerOpen(true)}
                                className="flex items-center gap-1.5 mx-auto"
                            >
                                <ImagePlus className="h-4 w-4" />
                                Select Image
                            </Button>
                        </div>
                    )}
                </div>

                {/* Excerpt */}
                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        rows={4}
                        placeholder="Learn how to format JSON, identify common syntax errors, and fix invalid JSON with practical examples and developer tools."
                        {...register("excerpt")}
                    />
                </div>
            </CardContent>

            <MediaPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleSelectMedia}
                selectedMediaId={featuredImageId}
            />
        </Card>
    );
}