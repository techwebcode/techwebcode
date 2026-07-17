"use client";

import Link from "next/link";

import { Menu } from "lucide-react";

import {

    Sheet,

    SheetContent,

    SheetHeader,

    SheetTitle,

    SheetTrigger,

} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const menus = [

    {

        title: "Home",

        href: "/",

    },

    {

        title: "Articles",

        href: "/articles",

    },

    {

        title: "Categories",

        href: "/categories",

    },

    {

        title: "About",

        href: "/about",

    },

];

export default function MobileMenu() {

    return (

        <Sheet>

            <SheetTrigger>

                <Button
                    variant="ghost"
                    size="icon"
                >

                    <Menu className="h-5 w-5" />

                </Button>

            </SheetTrigger>

            <SheetContent side="left">

                <SheetHeader>

                    <SheetTitle>

                        TechWebCode

                    </SheetTitle>

                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-6">

                    {menus.map((item) => (

                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-lg font-medium"
                        >

                            {item.title}

                        </Link>

                    ))}

                </nav>

            </SheetContent>

        </Sheet>

    );

}