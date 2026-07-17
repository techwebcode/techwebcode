import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {

    readonly children: ReactNode;

    readonly className?: string;

    readonly as?: React.ElementType;

}

export default function Container({

    children,

    className,

    as: Component = "div",

}: Readonly<ContainerProps>) {

    return (

        <Component
            className={cn(
                "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
                className
            )}
        >

            {children}

        </Component>

    );

}