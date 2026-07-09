"use client";

import { ReactNode } from "react";
import { Search, Plus, RefreshCw } from "lucide-react";

import { AppButton } from "@/components/ui";
import { Input } from "../ui/input";

interface PageToolbarProps {
    /**
     * Page title
     * Example: Categories
     */
    title: string;

    /**
     * Search value
     */
    search?: string;

    /**
     * Placeholder for search box
     */
    searchPlaceholder?: string;

    /**
     * Called whenever search changes
     */
    onSearchChange?: (value: string) => void;

    /**
     * Add button label
     */
    addLabel?: string;

    /**
     * Add button click
     */
    onAdd?: () => void;

    /**
     * Refresh click
     */
    onRefresh?: () => void;

    /**
     * Loading state
     */
    loading?: boolean;

    /**
     * Show Search Box
     */
    showSearch?: boolean;

    /**
     * Show Refresh Button
     */
    showRefresh?: boolean;

    /**
     * Show Add Button
     */
    showAdd?: boolean;

    /**
     * Custom buttons
     */
    actions?: ReactNode;
}

export default function PageToolbar({
    title,
    search = "",
    searchPlaceholder = "Search...",
    onSearchChange,
    addLabel = "Add New",
    onAdd,
    onRefresh,
    loading = false,
    showSearch = true,
    showRefresh = true,
    showAdd = true,
    actions,
}: PageToolbarProps) {
    return (
        <div className="mb-6 rounded-xl border bg-white shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                    {actions}

                    {showRefresh && onRefresh && (
                        <AppButton
                            type="button"
                            loading={loading}
                            onClick={onRefresh}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw size={16} />

                            Refresh
                        </AppButton>
                    )}

                    {showAdd && onAdd && (
                        <AppButton
                            type="button"
                            onClick={onAdd}
                            className="flex items-center gap-2"
                        >
                            <Plus size={18} />

                            {addLabel}
                        </AppButton>
                    )}

                </div>

            </div>

            {/* Search */}

            {showSearch && onSearchChange && (
                <div className="p-6">

                    <div className="relative max-w-md">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <Input
                            value={search}
                            placeholder={searchPlaceholder}
                            className="pl-10"
                            onChange={(e) =>
                                onSearchChange(e.target.value)
                            }
                        />

                    </div>

                </div>
            )}

        </div>
    );
}