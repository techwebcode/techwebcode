"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />;
      case "light":
        return <Sun className="h-5 w-5 text-amber-500" />;
      default:
        return <Monitor className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Theme options">
            {renderIcon()}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-40 rounded-xl">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 cursor-pointer font-medium ${
            theme === "light" ? "text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/40" : ""
          }`}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 cursor-pointer font-medium ${
            theme === "dark" ? "text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40" : ""
          }`}
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Dark</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 cursor-pointer font-medium ${
            theme === "system" ? "text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/40" : ""
          }`}
        >
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}