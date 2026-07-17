"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    search: string;
    category: string;
    sort: string;

    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

export default function ArticleFilters({
    search,
    category,
    sort,
    onSearchChange,
    onCategoryChange,
    onSortChange,
}: Readonly<Props>) {
    return (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
                <Select
                    value={category}
                    onValueChange={(value) => {
                        if (value) {
                            onCategoryChange(value);
                        }
                    }}
                >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {category === "all" ? "All Categories" : category}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">
                        All Categories
                    </SelectItem>

                    {/* Dynamic categories */}
                    {/* <SelectItem value="react">React</SelectItem>
                    <SelectItem value="golang">Go</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem> */}
                </SelectContent>
            </Select>

            <Select
                value={sort}
                onValueChange={(value) => {
                    if(value){
                    onSortChange(value)
                    }
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {sort === "latest"
                            ? "Latest"
                            : sort === "popular"
                            ? "Most Viewed"
                            : "Oldest"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="latest">
                        Latest
                    </SelectItem>

                    <SelectItem value="popular">
                        Most Viewed
                    </SelectItem>

                    <SelectItem value="oldest">
                        Oldest
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}