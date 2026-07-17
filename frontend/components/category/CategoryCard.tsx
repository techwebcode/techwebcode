import Link from "next/link";

import {
    FolderOpen,
    ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { Category } from "@/types/category";

interface Props {
    category: Category & {
        article_count?: number;
    };
}

export default function CategoryCard({
    category,
}: Readonly<Props>) {

    return (

        <Link
            href={`/categories/${category.slug}`}
        >

            <Card
                className="
                    group
                    h-full
                    rounded-2xl
                    border
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-primary
                    hover:shadow-lg
                "
            >

                <div className="flex items-center justify-between">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary/10
                            text-primary
                        "
                    >

                        <FolderOpen className="h-6 w-6" />

                    </div>

                    <ArrowRight
                        className="
                            h-5
                            w-5
                            text-muted-foreground
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                    />

                </div>

                <h3 className="mt-6 text-xl font-semibold">

                    {category.name}

                </h3>

                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">

                    {category.description}

                </p>

                <div className="mt-6">

                    <span
                        className="
                            rounded-full
                            bg-muted
                            px-3
                            py-1
                            text-xs
                            font-medium
                        "
                    >

                        {category.article_count ?? 0} Articles

                    </span>

                </div>

            </Card>

        </Link>

    );

}