"use client";

import Image from "next/image";
import { Pencil, Trash2, Eye } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/article";
import { toDateTimeFormat } from "@/lib/utils";


interface ArticleTableProps {
    articles: Article[];
    loading?: boolean;
    onEdit?: (article: Article) => void;
    onDelete?: (article: Article) => void;
}

export default function ArticleTable({
    articles,
    loading = false,
    onEdit,
    onDelete,
}: ArticleTableProps) {

    if (loading) {
        return (
            <div className="py-10 text-center text-gray-500">
                Loading articles...
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="py-10 text-center text-gray-500">
                No articles found.
            </div>
        );
    }

    const getStatusBadge = (
        status: Article["status"]
    ) => {
        switch (status) {
            case "published":
                return (
                    <Badge className="bg-green-600">
                        Published
                    </Badge>
                );

            case "draft":
                return (
                    <Badge variant="secondary">
                        Draft
                    </Badge>
                );

            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Table>

            <TableHeader>

                <TableRow>

                    <TableHead className="w-20">
                        Image
                    </TableHead>

                    <TableHead>
                        Title
                    </TableHead>

                    <TableHead>
                        Category
                    </TableHead>

                    <TableHead>
                        Status
                    </TableHead>

                    <TableHead>
                        Featured
                    </TableHead>

                    <TableHead>
                        Views
                    </TableHead>

                    <TableHead>
                        Reading
                    </TableHead>


                    <TableHead>
                        Published
                    </TableHead>

                    <TableHead className="text-right">
                        Actions
                    </TableHead>

                    {/* <TableHead>
                        Author
                    </TableHead> */}

                </TableRow>

            </TableHeader>

            <TableBody>

                {articles.map((article) => (

                    <TableRow key={article.id}>

                        <TableCell>

                            {article.featured_image ? (

                                <Image
                                    src={article.featured_image}
                                    alt={article.title}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover"
                                />

                            ) : (

                                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                    No Image
                                </div>

                            )}

                        </TableCell>

                        <TableCell>

                            <div>

                                <div className="font-medium">
                                    {article.title}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {article.slug}
                                </div>

                            </div>

                        </TableCell>

                        <TableCell>
                            {article.category.name}
                        </TableCell>

                        <TableCell>
                            {getStatusBadge(article.status)}
                        </TableCell>

                        <TableCell>
                            {article.is_featured}
                        </TableCell>

                        <TableCell>

                            <div className="flex items-center gap-1">

                                <Eye className="h-4 w-4" />

                                {article.view_count}

                            </div>

                        </TableCell>

                        <TableCell>
                            {article.reading_time} min
                        </TableCell>

                        <TableCell>
                            {toDateTimeFormat(article.published_at)}
                        </TableCell>

                        <TableCell>

                            <div className="flex justify-end gap-2">

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        onEdit?.(article)
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                        onDelete?.(article)
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                            </div>

                        </TableCell>

                    </TableRow>

                ))}

            </TableBody>

        </Table>
    );
}