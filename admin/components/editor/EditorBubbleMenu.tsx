"use client";

import { useState } from "react";

import { Editor, BubbleMenu } from "@tiptap/react";

import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link2,
    Unlink,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
    editor: Editor;
}

export default function EditorBubbleMenu({
    editor,
}: Readonly<Props>) {

    const [url, setUrl] = useState("");

    if (!editor) return null;

    const addLink = () => {

        const previous =
            editor.getAttributes("link").href ?? "";

        const link =
            window.prompt(
                "Enter URL",
                previous || url
            );

        if (link === null) return;

        if (link === "") {

            editor
                .chain()
                .focus()
                .unsetLink()
                .run();

            return;
        }

        editor
            .chain()
            .focus()
            .setLink({
                href: link,
                target: "_blank",
            })
            .run();

        setUrl(link);

    };

    return (

        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "top",
            }}
            className="flex gap-1 rounded-lg border bg-white p-2 shadow-lg"
        >

            <Button
                size="icon"
                variant={
                    editor.isActive("bold")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                size="icon"
                variant={
                    editor.isActive("italic")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Button
                size="icon"
                variant={
                    editor.isActive("strike")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <Button
                size="icon"
                variant={
                    editor.isActive("code")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleCode()
                        .run()
                }
            >
                <Code className="h-4 w-4" />
            </Button>

            <Button
                size="icon"
                variant={
                    editor.isActive("link")
                        ? "default"
                        : "ghost"
                }
                onClick={addLink}
            >
                <Link2 className="h-4 w-4" />
            </Button>

            {editor.isActive("link") && (

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .unsetLink()
                            .run()
                    }
                >
                    <Unlink className="h-4 w-4" />
                </Button>

            )}

        </BubbleMenu>

    );

}