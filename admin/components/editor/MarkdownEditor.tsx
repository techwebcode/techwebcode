"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AppCard } from "@/components/ui";
import Editor from "./Editor";

export default function MarkdownEditor() {

    const {
    register,
    watch,
    setValue,
} = useFormContext();

    const markdown = watch("content_markdown");

    const wordCount =
        markdown
            ?.trim()
            ?.split(/\s+/)
            ?.filter(Boolean)
            ?.length || 0;

    const readingTime = Math.max(
        1,
        Math.ceil(wordCount / 200)
    );
    return (
        <div className="flex gap-6 text-sm text-gray-500">

            <span>

                Words: {wordCount}

            </span>

            <span>

                Reading: {readingTime} min

            </span>

            <AppCard title="Article">

            <div className="space-y-5">

                <Input
                    // label="Title"
                    placeholder="Enter article title..."
                    {...register("title")}
                />
                <Input
                    // label="Slug"
                    {...register("slug")}
                />

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Excerpt
                    </label>

                   <Editor

                        value={watch("content_markdown")}

                        onChange={(value)=>{

                        setValue(

                        "content_markdown",

                        value

                        )

                        }}

                    />
                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Markdown
                    </label>

                    <Editor

                        value={watch("content_markdown")}

                        onChange={(value)=>{

                        setValue(

                        "content_markdown",

                        value

                        )

                        }}

                    />

                </div>

                </div>

            </AppCard>
    
        </div>
    );
}