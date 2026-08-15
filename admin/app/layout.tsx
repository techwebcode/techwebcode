import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans")}>
            <body>
                <QueryProvider>
                    {children}
                    <Toaster richColors />
                </QueryProvider>
            </body>
        </html>
    );
}