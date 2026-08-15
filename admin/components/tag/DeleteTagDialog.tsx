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

import { Tag } from "@/types/tag";
import { useDeleteTag } from "@/hooks/useTags";

interface Props {
    open: boolean;
    tag: Tag | null;
    onClose: () => void;
}

export default function DeleteTagDialog({
    open,
    tag,
    onClose,
}: Props) {

    const mutation = useDeleteTag();

    const handleDelete = () => {

        if (!tag) return;

        mutation.mutate(tag.id, {
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
                        Delete Tag
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{tag?.name}</strong>?
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
