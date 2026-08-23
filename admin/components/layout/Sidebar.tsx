"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, FileText, Tags, ImageIcon, Mail, Settings, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/auth";

const menus = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Contact Messages",
        href: "/dashboard/contact-messages",
        icon: Mail,
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
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-white min-h-screen flex flex-col justify-between">
            <div>
                <div className="p-6 text-xl font-bold tracking-tight border-b flex items-center justify-between">
                    <div>
                        <span className="text-blue-600">Tech</span>
                        <span>WebCode</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Admin
                    </span>
                </div>

                <nav className="space-y-1 px-3 mt-4">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        const isActive = pathname === menu.href || (menu.href !== "/dashboard" && pathname.startsWith(menu.href));

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon size={18} />
                                {menu.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t">
                <button
                    type="button"
                    onClick={() => logoutAdmin()}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <LogOut size={18} />
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}