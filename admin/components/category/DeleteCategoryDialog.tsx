"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Category } from "@/types/category";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";

interface Props {
    open: boolean;
    category: Category | null;
    onClose: () => void;
}

export default function DeleteCategoryDialog({
    open,
    category,
    onClose,
}: Props) {

    const mutation = useDeleteCategory();

    const handleDelete = () => {

        if (!category) return;

        mutation.mutate(category.id, {
            onSuccess() {
                onClose();
            },
        });

    };

    return (
        <AlertDialog open={open}>

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>
                        Delete Category
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{category?.name}</strong>?
                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel onClick={onClose}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
    );
}