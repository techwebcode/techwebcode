"use client";

import { Editor } from "@tiptap/react";

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code2,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Undo2,
    Redo2,
    Link2,
    Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
    editor: Editor | null;
}

export default function EditorToolbar({
    editor,
}: Readonly<Props>) {

    if (!editor) return null;

    const imageUrl = () => {

        const url = window.prompt("Image URL");

        if (!url) return;

        editor
            .chain()
            .focus()
            .setImage({ src: url })
            .run();
    };

    const addLink = () => {

        const previous =
            editor.getAttributes("link").href;

        const url = window.prompt(
            "Enter URL",
            previous
        );

        if (url === null) return;

        if (url === "") {

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
                href: url,
                target: "_blank",
            })
            .run();
    };

    return (

        <div className="mb-2 flex flex-wrap gap-2 rounded-lg border bg-muted/40 p-2">

            {/* Undo */}

            <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                    editor.chain().focus().undo().run()
                }
            >
                <Undo2 className="h-4 w-4" />
            </Button>

            {/* Redo */}

            <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                    editor.chain().focus().redo().run()
                }
            >
                <Redo2 className="h-4 w-4" />
            </Button>

            <div className="mx-2 w-px bg-border" />

            {/* H1 */}

            <Button
                size="icon"
                variant={
                    editor.isActive("heading", {
                        level: 1,
                    })
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({
                            level: 1,
                        })
                        .run()
                }
            >
                <Heading1 className="h-4 w-4" />
            </Button>

            {/* H2 */}

            <Button
                size="icon"
                variant={
                    editor.isActive("heading", {
                        level: 2,
                    })
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({
                            level: 2,
                        })
                        .run()
                }
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <div className="mx-2 w-px bg-border" />

            {/* Bold */}

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

            {/* Italic */}

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

            {/* Underline */}

            <Button
                size="icon"
                variant={
                    editor.isActive("underline")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run()
                }
            >
                <Underline className="h-4 w-4" />
            </Button>

            {/* Strike */}

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

            {/* Code */}

            <Button
                size="icon"
                variant={
                    editor.isActive("codeBlock")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleCodeBlock()
                        .run()
                }
            >
                <Code2 className="h-4 w-4" />
            </Button>

            <div className="mx-2 w-px bg-border" />

            {/* Bullet */}

            <Button
                size="icon"
                variant={
                    editor.isActive("bulletList")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
            >
                <List className="h-4 w-4" />
            </Button>

            {/* Ordered */}

            <Button
                size="icon"
                variant={
                    editor.isActive("orderedList")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            {/* Quote */}

            <Button
                size="icon"
                variant={
                    editor.isActive("blockquote")
                        ? "default"
                        : "ghost"
                }
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBlockquote()
                        .run()
                }
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="mx-2 w-px bg-border" />

            {/* Link */}

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

            {/* Image */}

            <Button
                size="icon"
                variant="ghost"
                onClick={imageUrl}
            >
                <ImageIcon className="h-4 w-4" />
            </Button>

        </div>

    );

}