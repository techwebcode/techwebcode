"use client";

import CategoryModal from "@/components/category/CategoryModal";
import CategoryTable from "@/components/category/CategoryTable";
import DeleteCategoryDialog from "@/components/category/DeleteCategoryDialog";
import PageToolbar from "@/components/common/PageToolbar";
import AppCard from "@/components/ui/AppCard";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { useState } from "react";



export default function CategoriesPage() {
    const [open, setOpen] = useState(false);
    const [page] = useState(1);
    const [search, setSearch] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
    const {
        data,
        isLoading,
        isFetching,
        refetch,
    } = useCategories(page, 20, search);

    
   return (
        <div className="space-y-6 p-6">
            <PageToolbar
                title="Categories"
                search=""
                searchPlaceholder="Search categories..."
                onSearchChange={(value) => {setSearch(value);}}
                addLabel="Add Category"
                onAdd={() => {
                    setSelectedCategory(null);
                    setOpen(true);
                }}
                onRefresh={() => {
                    refetch();
                }}
                loading={isFetching}
            />
            <CategoryModal
                open={open}
                onClose={() => setOpen(false)}
                category={selectedCategory}
            />
            <AppCard>
                <CategoryTable
                    categories={data ?? []}
                    loading={isLoading}
                    onEdit={(category) => {
                        setSelectedCategory(category);
                        setOpen(true);
                    }}
                    onDelete={(category) => {
                        setSelectedCategory(category);
                        setDeleteOpen(true);
                    }}
                />
            </AppCard>
            <DeleteCategoryDialog
                open={deleteOpen}
                category={selectedCategory}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedCategory(null);
                }}
            />
        </div>
    );
}