"use client";

import { ReactNode, useState } from "react";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider } from "next-themes";

import { Toaster } from "sonner";

interface Props {
    readonly children: ReactNode;
}

export default function Providers({
    children,
}: Props) {

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60 * 5,
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            })
    );

    return (

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >

            <QueryClientProvider
                client={queryClient}
            >

                {children}

                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={3000}
                />

            </QueryClientProvider>

        </ThemeProvider>

    );

}