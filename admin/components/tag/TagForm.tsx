"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tag } from "@/types/tag";
import { TagSchema } from "@/validation/tag";

interface TagFormProps {
    readonly tag?: Tag | null;
    readonly loading?: boolean;
    readonly onSubmit: (data: any) => void;
    readonly onCancel?: () => void;
}

export default function TagForm({
    tag,
    loading = false,
    onSubmit,
    onCancel,
}: TagFormProps) {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(TagSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            status: true,
            sort_order: 0,
        },
    });

    useEffect(() => {
        if (tag) {
            reset(tag);
        } else {
            reset({
                name: "",
                slug: "",
                description: "",
                status: true,
                sort_order: 0,
            });
        }
    }, [tag, reset]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue("name", val, { shouldValidate: true });
        if (!tag) {
            const generatedSlug = val
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            setValue("slug", generatedSlug, { shouldValidate: true });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tag Name</Label>
                    <Input
                        id="name"
                        placeholder="e.g. React"
                        {...register("name")}
                        onChange={handleNameChange}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{String(errors.name.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        placeholder="e.g. react"
                        {...register("slug")}
                    />
                    {errors.slug && (
                        <p className="text-xs text-destructive">{String(errors.slug.message)}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    placeholder="Brief description of the tag..."
                    {...register("description")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
                <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                        id="sort_order"
                        type="number"
                        {...register("sort_order", {
                            valueAsNumber: true,
                        })}
                    />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                    <input
                        type="checkbox"
                        id="status"
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary cursor-pointer"
                        {...register("status")}
                    />
                    <Label htmlFor="status" className="cursor-pointer font-medium">
                        Active Tag
                    </Label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : tag ? (
                        "Update Tag"
                    ) : (
                        "Create Tag"
                    )}
                </Button>
            </div>
        </form>
    );
}