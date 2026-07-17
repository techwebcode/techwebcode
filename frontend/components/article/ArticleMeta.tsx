import {
    Calendar,
    Clock3,
    Eye,
} from "lucide-react";

import { formatDate } from "@/lib/utils";

interface Props {

    readonly publishedAt?: string | null;

    readonly createdAt: string;

    readonly readingTime: number;

    readonly viewCount: number;

    readonly className?: string;

}

export default function ArticleMeta({

    publishedAt,

    createdAt,

    readingTime,

    viewCount,

    className,

}: Readonly<Props>) {

    return (

        <div
            className={`flex flex-wrap items-center gap-5 text-sm text-muted-foreground ${className ?? ""}`}
        >

            <div className="flex items-center gap-2">

                <Calendar className="h-4 w-4" />

                {formatDate(
                    publishedAt ?? createdAt
                )}

            </div>

            <div className="flex items-center gap-2">

                <Clock3 className="h-4 w-4" />

                {readingTime} min read

            </div>

            <div className="flex items-center gap-2">

                <Eye className="h-4 w-4" />

                {viewCount.toLocaleString()}

            </div>

        </div>

    );

}