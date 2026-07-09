"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Category } from "@/types/category";

interface CategoryTableProps {
    categories: Category[];
    loading?: boolean;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
}

export default function CategoryTable({
    categories,
    loading = false,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading categories...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No categories found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Description
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Slug
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="transition-colors hover:bg-gray-50"
                        >
                            <td className="px-4 py-4 font-medium text-gray-900">
                                {category.name}
                            </td>

                            <td className="px-4 py-4 font-medium text-gray-900">
                                {category.description}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                                {category.slug}
                            </td>

                            <td className="px-4 py-4">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        category.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {category.status ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(category)}
                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(category)}
                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}