"use client";

import { Article } from "@/types/article";

import AppModal from "@/components/ui/AppModal";
import ArticleForm from "./ArticleForm";

import { useCreateArticle } from "@/hooks/useCreateArticle";
import { useUpdateArticle } from "@/hooks/useUpdateArticle";

interface ArticleModalProps {
    open: boolean;
    article?: Article | null;
    onClose: () => void;
}

export default function ArticleModal({
    open,
    article,
    onClose,
}: ArticleModalProps) {

    const createMutation = useCreateArticle();

    const updateMutation = useUpdateArticle();

    const loading =
        createMutation.isPending ||
        updateMutation.isPending;

    const handleSubmit = (values: any) => {

        if (article) {

            updateMutation.mutate(
                {
                    id: article.id,
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
                article
                    ? "Edit Article"
                    : "Create Article"
            }
            onClose={onClose}
            maxWidth="xl"
        >

            <ArticleForm
                article={article}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </AppModal>

    );

}