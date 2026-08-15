"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContentSection() {

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const rawMarkdown = watch("content_markdown") ?? "";

    // Normalize missing space after # for headings (e.g. #Heading -> # Heading)
    const markdown = rawMarkdown.replace(/^([#]{1,6})([^\s#])/gm, "$1 $2");

    const wordCount = rawMarkdown
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const readingTime =
        Math.max(
            1,
            Math.ceil(wordCount / 200)
        );

    useEffect(() => {
        setValue("reading_time", readingTime);
    }, [readingTime, setValue]);

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>
                    Article Content (Markdown)
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

                {/* Markdown Input */}

                <div className="space-y-2">

                    <Label htmlFor="content_markdown">
                        Content (Markdown Syntax)
                    </Label>

                    <Textarea
                        id="content_markdown"
                        rows={18}
                        placeholder={`# Introduction

Write your article here using standard Markdown syntax (space after # is required for headings)...

## Key Takeaways

- Easy to format with standard markdown tags
- Supports headings, lists, links, and code blocks

### Code Example

\`\`\`json
{
  "name": "Alice",
  "age": 28
}
\`\`\``}
                        className="font-mono text-sm leading-relaxed"
                        {...register("content_markdown")}
                    />

                    {errors.content_markdown && (
                        <p className="mt-1 text-sm text-destructive font-medium">
                            {String(errors.content_markdown.message)}
                        </p>
                    )}

                </div>

                {/* ReactMarkdown Live Preview */}

                <div className="space-y-2">

                    <Label>
                        Content Live Preview
                    </Label>

                    <div
                        className="
                            min-h-[250px]
                            rounded-xl
                            border
                            border-border
                            bg-muted/20
                            p-6
                            overflow-x-auto
                        "
                    >
                        {markdown.trim() ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-3xl font-extrabold text-foreground mt-6 mb-4 leading-tight border-b border-border pb-2">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-bold text-foreground mt-6 mb-3 leading-snug">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-bold text-foreground mt-4 mb-2">
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children }) => (
                                        <h4 className="text-lg font-semibold text-foreground mt-3 mb-1">
                                            {children}
                                        </h4>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-foreground leading-relaxed my-3 text-sm">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc pl-6 my-3 space-y-1.5 text-foreground text-sm">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal pl-6 my-3 space-y-1.5 text-foreground text-sm">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="leading-relaxed">
                                            {children}
                                        </li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-primary pl-4 py-1.5 italic text-muted-foreground bg-muted/30 rounded-r-lg my-4 text-sm">
                                            {children}
                                        </blockquote>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary underline font-medium hover:opacity-80 transition-opacity"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    code: ({ className, children, ...props }: any) => {
                                        const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                                        return isBlock ? (
                                            <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto border border-border font-mono text-xs my-4 leading-relaxed">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        ) : (
                                            <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border/50" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-muted-foreground italic text-sm">
                                Start typing markdown above to see live preview...
                            </p>
                        )}
                    </div>

                </div>

            </CardContent>

        </Card>

    );

}