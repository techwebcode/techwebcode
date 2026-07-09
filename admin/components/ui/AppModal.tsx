"use client";

import { ReactNode } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

interface AppModalProps {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;

    maxWidth?:
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "6xl"
        | "7xl";
}

const maxWidthClass = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    "2xl": "sm:max-w-5xl",
    "3xl": "sm:max-w-6xl",
    "4xl": "sm:max-w-[72rem]",
    "5xl": "sm:max-w-[80rem]",
    "6xl": "sm:max-w-[90rem]",
    "7xl": "sm:max-w-[100rem]",
};

export default function AppModal({
    open,
    title,
    description,
    children,
    onClose,
    maxWidth = "md",
}: Readonly<AppModalProps>) {

    return (

        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
        >

            <DialogContent
                className={cn(
                    "flex h-[90vh] w-[95vw] flex-col overflow-hidden p-0",
                    maxWidthClass[maxWidth]
                )}
            >

                <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">

                    <DialogTitle>
                        {title}
                    </DialogTitle>

                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}

                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">

                    {children}

                </div>

            </DialogContent>

        </Dialog>

    );
}