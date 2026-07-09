import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline"

export const extensions = [

    StarterKit,

    Placeholder.configure({

        placeholder: "Start writing your tutorial..."

    }),

    Link.configure({
        openOnClick: false,
    }),

    Image,

    Underline,
];