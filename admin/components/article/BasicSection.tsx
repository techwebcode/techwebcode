"use client";

import { ChangeEvent } from "react";
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

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

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

    const image = watch("featured_image");

    const selectedTags: number[] =
        watch("tag_ids") ?? [];

    const toggleTag = (id: number) => {

        if (selectedTags.includes(id)) {

            setValue(
                "tag_ids",
                selectedTags.filter(
                    (tagId) => tagId !== id
                )
            );

            return;
        }

        setValue(
            "tag_ids",
            [...selectedTags, id]
        );

    };

    const imageChanged = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        // TODO Upload image API
        const preview = URL.createObjectURL(file);

        setValue(
            "featured_image",
            preview
        );

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

                    <Label>
                        Title
                    </Label>

                    <Input
                        placeholder="Go Tutorial for Beginners"
                        {...register("title")}
                    />

                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {String(
                                errors.title.message
                            )}
                        </p>
                    )}

                </div>

                {/* Slug */}

                <div>

                    <Label>
                        Slug
                    </Label>

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

                                    {categoryOptions?.map(
                                        (category) => (

                                            <SelectItem
                                                key={category.id}
                                                value={String(
                                                    category.id
                                                )}
                                            >

                                                {category.name}

                                            </SelectItem>

                                        )
                                    )}

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

                                    {toolOptions?.map(
                                        (tool) => (

                                            <SelectItem
                                                key={tool.id}
                                                value={String(tool.id)}
                                            >

                                                {tool.name}

                                            </SelectItem>

                                        )
                                    )}

                                </SelectContent>

                            </Select>
                        );
                    })()}

                </div>

                {/* Tags */}

                <div>

                    <Label>
                        Tags
                    </Label>

                    <div className="mt-3 flex flex-wrap gap-2">

                        {(tagOptions ?? []).map((tag: any) => (

                            <button
                                type="button"
                                key={tag.id}
                                onClick={() =>
                                    toggleTag(tag.id)
                                }
                                className={`rounded-full border px-4 py-2 text-sm transition
                                    ${
                                        selectedTags.includes(
                                            tag.id
                                        )
                                            ? "bg-primary text-white"
                                            : "bg-background"
                                    }`}
                            >

                                {tag.name}

                            </button>

                        ))}

                    </div>

                </div>

                {/* Featured Image */}

                <div>

                    <Label>
                        Featured Image
                    </Label>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={imageChanged}
                    />

                    {image && (

                        <img
                            src={image}
                            alt="Preview"
                            className="mt-4 h-40 rounded-lg border object-cover"
                        />

                    )}

                </div>

                {/* Excerpt */}

                <div>

                    <Label htmlFor="excerpt">
                        Excerpt
                    </Label>

                    <Textarea
                        id="excerpt"
                        rows={4}
                        placeholder="Learn how to format JSON, identify common syntax errors, and fix invalid JSON with practical examples and developer tools."
                        {...register("excerpt")}
                    />

                </div>

            </CardContent>

        </Card>

    );

}