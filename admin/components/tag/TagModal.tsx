"use client";

import { Tag } from "@/types/tag";

import AppModal from "@/components/ui/AppModal";

import TagForm from "../tag/TagForm";

import { useCreateTag, useUpdateTag } from "@/hooks/useTags";

interface Props {

    open: boolean;

    tag?: Tag | null;

    onClose: () => void;

}

export default function TagModal({

    open,

    tag,

    onClose,

}: Props) {

    const createMutation = useCreateTag();

    const updateMutation = useUpdateTag();

    const loading =
        createMutation.isPending ||
        updateMutation.isPending;

    const handleSubmit = (values: any) => {

        if (tag) {

            updateMutation.mutate(
                {
                    id: tag.id,
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
                tag
                    ? "Edit Tag"
                    : "Create Tag"
            }
            onClose={onClose}
        >

            <TagForm
                tag={tag}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </AppModal>

    );

}