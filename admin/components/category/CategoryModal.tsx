"use client";

import { Category } from "@/types/category";

import AppModal from "@/components/ui/AppModal";

import CategoryForm from "./CategoryForm";

import { useCreateCategory } from "@/hooks/useCreateCategory";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";

interface Props {

    open: boolean;

    category?: Category | null;

    onClose: () => void;

}

export default function CategoryModal({

    open,

    category,

    onClose,

}: Props) {

    const createMutation = useCreateCategory();

    const updateMutation = useUpdateCategory();

    const loading =
        createMutation.isPending ||
        updateMutation.isPending;

    const handleSubmit = (values: any) => {

        if (category) {

            updateMutation.mutate(
                {
                    id: category.id,
                    ...values,
                },
                {
                    onSuccess() {
                        onClose();
                    },
                }
            );

            return;
        }

        createMutation.mutate(
            values,
            {
                onSuccess() {
                    onClose();
                },
            }
        );
    };

    return (

        <AppModal
            open={open}
            title={
                category
                    ? "Edit Category"
                    : "Create Category"
            }
            onClose={onClose}
        >

            <CategoryForm
                category={category}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </AppModal>

    );

}