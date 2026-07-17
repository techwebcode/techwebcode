"use client";

import { useEffect, useState } from "react";

import { Moon, Sun, Monitor } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {

    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {

        setMounted(true);

    }, []);

    if (!mounted) {
        return null;
    }

    const Icon = () => {

        switch (theme) {

            case "dark":
                return <Moon className="h-5 w-5" />;

            case "light":
                return <Sun className="h-5 w-5" />;

            default:
                return <Monitor className="h-5 w-5" />;

        }

    };

    return (

        <DropdownMenu>

            <DropdownMenuTrigger>

                <Button variant="ghost" size="icon">
                    <Icon />
                </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44"
            >

                <DropdownMenuItem
                    onClick={() =>
                        setTheme("light")
                    }
                >

                    <Sun className="mr-2 h-4 w-4" />

                    Light

                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        setTheme("dark")
                    }
                >

                    <Moon className="mr-2 h-4 w-4" />

                    Dark

                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        setTheme("system")
                    }
                >

                    <Monitor className="mr-2 h-4 w-4" />

                    System

                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>

    );

}