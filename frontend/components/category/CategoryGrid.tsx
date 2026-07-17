import { Category } from "@/types/category";

import CategoryCard from "./CategoryCard";

interface Props {

    categories: (Category & {
        article_count?: number;
    })[];

}

export default function CategoryGrid({
    categories,
}: Readonly<Props>) {

    return (

        <div
            className="
                grid
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >

            {categories.map((category) => (

                <CategoryCard
                    key={category.id}
                    category={category}
                />

            ))}

        </div>

    );

}