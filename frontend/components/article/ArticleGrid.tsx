import ArticleCard from "./ArticleCard";

import { Article } from "@/types/article";

interface Props {

    articles: Article[];

    columns?: 1 | 2 | 3 | 4;

}

export default function ArticleGrid({

    articles,

    columns = 3,

}: Readonly<Props>) {

    const gridCols = {

        1: "grid-cols-1",

        2: "grid-cols-1 md:grid-cols-2",

        3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",

        4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",

    };

    return (

        <div
            className={`grid gap-8 ${gridCols[columns]}`}
        >

            {articles.map((article) => (

                <ArticleCard
                    key={article.id}
                    article={article}
                />

            ))}

        </div>

    );

}