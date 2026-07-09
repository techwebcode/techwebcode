"use client";

import Link from "next/link";
import { LayoutDashboard, Folder, FileText, Tags, ImageIcon, Settings } from "lucide-react";

const menus = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Articles",
        href: "/dashboard/articles",
        icon: FileText,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Folder,
    },
    {
        title: "Tags",
        href: "/dashboard/tags",
        icon: Tags,
    },
    {
        title: "Media",
        href: "/dashboard/media",
        icon: ImageIcon,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r bg-white">

            <div className="p-6 text-xl font-bold">
                TechWebCode
            </div>

            <nav className="space-y-1 px-3">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                            <Icon size={18} />
                            {menu.title}
                        </Link>
                    );
                })}

            </nav>

        </aside>
    );
}