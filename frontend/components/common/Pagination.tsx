"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {

    page: number;

    totalPages: number;

    onPageChange: (page: number) => void;

}

export default function Pagination({

    page,

    totalPages,

    onPageChange,

}: Readonly<Props>) {

    if (totalPages <= 1) {

        return null;

    }

    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    );

    return (

        <div className="mt-10 flex items-center justify-center gap-2">

            <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() =>
                    onPageChange(page - 1)
                }
            >

                <ChevronLeft className="h-4 w-4" />

            </Button>

            {pages.map((number) => (

                <Button
                    key={number}
                    variant={
                        page === number
                            ? "default"
                            : "outline"
                    }
                    onClick={() =>
                        onPageChange(number)
                    }
                >

                    {number}

                </Button>

            ))}

            <Button
                variant="outline"
                size="icon"
                disabled={
                    page === totalPages
                }
                onClick={() =>
                    onPageChange(page + 1)
                }
            >

                <ChevronRight className="h-4 w-4" />

            </Button>

        </div>

    );

}