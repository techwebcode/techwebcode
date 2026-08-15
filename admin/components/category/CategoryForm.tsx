"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/category";
import { CategorySchema } from "@/validation/category";

interface CategoryFormProps {
    readonly category?: Category | null;
    readonly loading?: boolean;
    readonly onSubmit: (data: any) => void;
    readonly onCancel?: () => void;
}

export default function CategoryForm({
    category,
    loading = false,
    onSubmit,
    onCancel,
}: CategoryFormProps) {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            status: true,
            sort_order: 0,
        },
    });

    const nameValue = watch("name");

    useEffect(() => {
        if (category) {
            reset(category);
        } else {
            reset({
                name: "",
                slug: "",
                description: "",
                status: true,
                sort_order: 0,
            });
        }
    }, [category, reset]);

    // Auto-generate slug for new categories if slug is empty
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue("name", val, { shouldValidate: true });
        if (!category) {
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
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                        id="name"
                        placeholder="e.g. Web Development"
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
                        placeholder="e.g. web-development"
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
                    placeholder="Brief description of the category..."
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
                        Active Category
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
                    ) : category ? (
                        "Update Category"
                    ) : (
                        "Create Category"
                    )}
                </Button>
            </div>
        </form>
    );
}