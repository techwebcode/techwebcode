import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {

    readonly title: string;

    readonly description?: string;

    readonly href?: string;

    readonly linkText?: string;

    readonly className?: string;

}

export default function SectionHeading({

    title,

    description,

    href,

    linkText = "View All",

    className,

}: Readonly<Props>) {

    return (

        <div
            className={cn(
                "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
                className
            )}
        >

            <div>

                <h2 className="text-3xl font-bold tracking-tight">

                    {title}

                </h2>

                {description && (

                    <p className="mt-2 max-w-2xl text-muted-foreground">

                        {description}

                    </p>

                )}

            </div>

            {href && (

                <Link
                    href={href}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-primary
                        transition-all
                        hover:gap-3
                    "
                >

                    {linkText}

                    <ArrowRight className="h-4 w-4" />

                </Link>

            )}

        </div>

    );

}