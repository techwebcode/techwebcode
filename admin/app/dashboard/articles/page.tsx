"use client";

import ArticleTable from "@/components/category/ArticleTable";
import PageToolbar from "@/components/common/PageToolbar";
import { AppCard } from "@/components/ui";
import { useArticles } from "@/hooks/useArticles";
import { useState } from "react";
import { Article } from "@/types/article";
import CategoryModal from "@/components/category/CategoryModal";
import ArticleModal from "@/components/article/ArticleModal";

export default function ArticlesPage() {

    const [page] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false)
    
    const { data, isLoading, isFetching, refetch } = useArticles(page, 20, search);
    return(
        <div className="space-y-6 p-6">

           <PageToolbar
                title="Articles"
                search=""
                searchPlaceholder="Search categories..."
                onSearchChange={(value) => {setSearch(value);}}
                addLabel="Add Article"
                onAdd={() => {
                    setSelectedArticle(null);
                    setOpen(true);
                }}
                onRefresh={() => {
                    refetch();
                }}
                loading={isFetching}
            />
             <AppCard>
                <ArticleTable
                    articles={data ?? []}
                    loading={isLoading}
                    onEdit={(article) => {
                        setSelectedArticle(article);
                        setOpen(true);
                    }}
                    onDelete={(article) => {
                        setSelectedArticle(article);
                        setDeleteOpen(true);
                    }}
                />
            </AppCard>

            <ArticleModal
                open={open}
                onClose={() => setOpen(false)}
                article={selectedArticle}
            />

    </div>
    )
}