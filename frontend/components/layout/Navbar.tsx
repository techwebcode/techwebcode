"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Menu,
    Search,
} from "lucide-react";

import Container from "./Container";

import { Button } from "@/components/ui/button";

import ThemeToggle from "./ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import { NAVIGATION } from "@/constants/navigation";



export default function Navbar() {

    const pathname = usePathname();

    return (

        <header
            className="
                sticky
                top-0
                z-50
                border-b
                bg-background/80
                backdrop-blur-xl
            "
        >

            <Container>

                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}

                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                    >

                        <span className="text-blue-600">
                            Tech
                        </span>

                        <span>
                            WebCode
                        </span>

                    </Link>

                    {/* Desktop Menu */}

                    <nav className="hidden items-center gap-8 md:flex">

                        {NAVIGATION.map((item) => (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    pathname === item.href
                                        ? "text-blue-600"
                                        : "text-muted-foreground"
                                }`}
                            >

                                {item.title}

                            </Link>

                        ))}

                    </nav>

                    {/* Right */}

                    <div className="flex items-center gap-2">

                        <Button
                            size="icon"
                            variant="ghost"
                        >

                            <Search className="h-5 w-5" />

                        </Button>

                        <div className="md:hidden">

                            <MobileMenu />

                        </div>

                        <ThemeToggle />

                        <Button
                            size="icon"
                            variant="ghost"
                            className="md:hidden"
                        >

                            <Menu className="h-5 w-5" />

                        </Button>

                    </div>

                </div>

            </Container>

        </header>

    );

}