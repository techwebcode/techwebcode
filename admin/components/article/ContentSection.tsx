"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AppCard } from "../ui";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContentSection() {

    const {
        register,
        watch,
        setValue,
    } = useFormContext<any>();

    const markdown = watch("content_markdown") ?? "";

    useEffect(() => {

        // Temporary HTML preview.
        // Replace this with a real markdown parser later.

        const html = markdown
            .replace(/\n/g, "<br/>");

        setValue(
            "content_html",
            html
        );

    }, [markdown, setValue]);

    const wordCount = markdown
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const readingTime =
        Math.max(
            1,
            Math.ceil(wordCount / 200)
        );

    useEffect(() => {

        setValue(
            "reading_time",
            readingTime
        );

    }, [readingTime, setValue]);

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>
                    Article Content
                </CardTitle>

                <div className="flex gap-2">

                    <Badge variant="outline">
                        {wordCount} words
                    </Badge>

                    <Badge>
                        {readingTime} min read
                    </Badge>

                </div>

            </CardHeader>

            <CardContent className="space-y-6">

                {/* Markdown */}

                <div>

                    <Label>
                        Markdown
                    </Label>

                    <Textarea
                        rows={20}
                        placeholder={`# Go Tutorial

                        Write your article here...

                        ## Heading

                        Lorem ipsum...

                        ### Code

                        \`\`\`go
                        fmt.Println("Hello")
                        \`\`\`
                        `}
                        className="font-mono"
                        {...register(
                            "content_markdown"
                        )}
                    />

                </div>

                {/* Preview */}

                <div>

                    <Label>
                        HTML Preview
                    </Label>

                    <div
                        className="
                            min-h-[300px]
                            rounded-lg
                            border
                            bg-muted/30
                            p-6
                            prose
                            prose-sm
                            max-w-none
                        "
                        dangerouslySetInnerHTML={{
                            __html:
                                watch(
                                    "content_html"
                                ) || "",
                        }}
                    />

                </div>

            </CardContent>

        </Card>

    );

}