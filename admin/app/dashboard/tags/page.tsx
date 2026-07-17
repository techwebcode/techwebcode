"use client";

import { useState } from "react";

import PageToolbar from "@/components/common/PageToolbar";

import TagModal from "@/components/tag/TagModal";
import AppCard from "@/components/ui/AppCard";
import DataTable from "@/components/ui/DataTable";

import { TagColumns } from "@/components/tag/Columns";

import { useTags } from "@/hooks/useTags";

import { Tag } from "@/types/tag";

export default function CategoriesPage() {

    const [page] = useState(1);

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedTag, setSelectedTag] =
        useState<Tag | null>(null);

    const {
        data,
        isLoading,
        isFetching,
        refetch,
    } = useTags(
        page,
        20,
        search
    );

    return (

        <div className="space-y-6 p-6">

            <PageToolbar
                title="Tags"
                search={search}
                searchPlaceholder="Search tag..."
                onSearchChange={setSearch}
                addLabel="Add Tag"
                onAdd={() => {

                    setSelectedTag(null);

                    setOpen(true);

                }}
                onRefresh={refetch}
                loading={isFetching}
            />

            <TagModal
                open={open}
                tag={selectedTag}
                onClose={() => {

                    setOpen(false);

                    setSelectedTag(null);

                }}
            />

            {/* <DeleteCategoryDialog
                open={deleteOpen}
                category={selectedTag}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedTag(null);

                }}
            /> */}

            <AppCard>

                <DataTable<Tag>

                    columns={TagColumns({

                        onEdit(category) {

                            setSelectedTag(category);

                            setOpen(true);

                        },

                        onDelete(category) {

                            setSelectedTag(category);

                            setDeleteOpen(true);

                        },

                    })
                    }

                    data={data ?? []}

                    loading={isLoading}

                    emptyMessage="No categories found."


                />

            </AppCard>

        </div>

    );

}