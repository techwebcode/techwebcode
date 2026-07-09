"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 60000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}