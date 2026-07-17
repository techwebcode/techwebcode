import Link from "next/link";

import { Badge } from "@/components/ui/badge";

interface Props {

    readonly name: string;

    readonly slug: string;

}

export default function CategoryBadge({

    name,

    slug,

}: Readonly<Props>) {

    return (

        <Link href={`/categories/${slug}`}>

            <Badge
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >

                {name}

            </Badge>

        </Link>

    );

}