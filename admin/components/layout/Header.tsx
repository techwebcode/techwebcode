"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExpectedAdminCredentials, logoutAdmin } from "@/lib/auth";

export default function Header() {
    const [adminName, setAdminName] = useState("admin");

    useEffect(() => {
        const creds = getExpectedAdminCredentials();
        setAdminName(creds.username);
    }, []);

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
            </h1>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 border px-3 py-1.5 text-xs font-semibold text-gray-700">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span>{adminName}</span>
                </div>

                <Link href="/dashboard/settings">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                        <Settings className="h-3.5 w-3.5" />
                        <span>Settings</span>
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logoutAdmin()}
                    className="h-8 gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                </Button>
            </div>
        </header>
    );
}