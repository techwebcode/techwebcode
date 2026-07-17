"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { TagSchema } from "@/validation/tag";
import { Tag } from "@/types/tag";

interface TagFormProps {
    readonly tag?: Tag | null;
    readonly loading?: boolean;
    readonly onSubmit: (data: any) => void;
}

export default function TagForm({
    tag,
    loading = false,
    onSubmit,
}: TagFormProps) {

    const {
        register,
        handleSubmit,
        reset,
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

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <label htmlFor="name">Tag Name</label>
            <Input
                placeholder="Go"
                {...register("name")}
            />
            <label htmlFor="slug">Slug</label>
            <Input
                placeholder="go"
                {...register("slug")}
            />

            <div>

                <label className="mb-2 block text-sm font-medium">
                    Description
                </label>

                <textarea
                    rows={4}
                    {...register("description")}
                    className="w-full rounded-lg border p-3"
                />

            </div>
            <label htmlFor="sort_order">Sort Order</label>
            <Input
                type="number"
                {...register("sort_order", {
                    valueAsNumber: true,
                })}
            />

            <label className="flex items-center gap-2">

                <input
                    type="checkbox"
                    {...register("status")}
                />

                Active

            </label>

            <div className="flex justify-end">

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
                    "Update tag"
                ) : (
                    "Create tag"
                )}
            </Button>

            </div>

        </form>

    );

}