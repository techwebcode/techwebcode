"use client";

import { useEffect } from "react";

import {
    EditorContent,
    useEditor,
} from "@tiptap/react";

import { extensions } from "./extensions";
import EditorToolbar from "./Toolbar";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function Editor({
    value,
    onChange,
}: Readonly<Props>) {

    const editor = useEditor({
        extensions,

        content: value || "",

        immediatelyRender: false,

        editorProps: {
            attributes: {
                class:
                    "min-h-[300px] p-6 outline-none prose max-w-none",
            },
        },

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {

        if (!editor) return;

        if (editor.getHTML() !== value) {
            editor.commands.setContent(value || "");
        }

    }, [editor, value]);

    if (!editor) {
        return null;
    }

    return (

        <div className="rounded-xl border bg-background">

            <EditorToolbar
                editor={editor}
            />

            <EditorContent
                editor={editor}
            />

        </div>

    );

}