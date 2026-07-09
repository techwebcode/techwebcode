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


interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

export default function BasicSection() {

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    // TODO: Replace with API hooks

    const { data, isLoading } = useCategoryOptions();

    const tags: Tag[] = [
        { id: 1, name: "Backend" },
        { id: 2, name: "API" },
        { id: 3, name: "Tutorial" },
        { id: 4, name: "Beginner" },
    ];

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
                        {...register("slug")}
                    />

                </div>

                {/* Category */}

                <div>

                    <Label>
                        Category
                    </Label>

                    <Select
                        onValueChange={(value) =>
                            setValue(
                                "category_id",
                                Number(value)
                            )
                        }
                    >

                        <SelectTrigger>

                            <SelectValue
                                placeholder="Select Category"
                            />

                        </SelectTrigger>

                        <SelectContent>

                            {data?.map(
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

                </div>

                {/* Tags */}

                <div>

                    <Label>
                        Tags
                    </Label>

                    <div className="mt-3 flex flex-wrap gap-2">

                        {tags.map((tag) => (

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

                    <Label>
                        Excerpt
                    </Label>

                    <Textarea
                        rows={5}
                        placeholder="Short summary of the article..."
                        {...register("excerpt")}
                    />

                </div>

            </CardContent>

        </Card>

    );

}