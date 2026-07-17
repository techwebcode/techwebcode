import { Pencil, Trash2 } from "lucide-react";

import { Tag } from "@/types/tag";

import { Column } from "@/components/ui/DataTable";

interface Props {

    onEdit(tag: Tag): void;

    onDelete(tag: Tag): void;

}

export const TagColumns = ({
    onEdit,
    onDelete,
}: Props): Column<Tag>[] => [

    {
        key: "name",
        title: "Name",
        className: "h-12 font-semibold text-foreground"
    },

    {
        key: "slug",
        title: "Slug",
    },

    {
        key: "status",
        title: "Status",

        render(value) {

            return value
                ? "Active"
                : "Inactive";

        },
    },

    {
        key: "actions",

        title: "Actions",
        className: "flex justify-end",

        render(_, row) {

            return (
                    <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(row)}
                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(row)}
                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
            );

        },
    },

];