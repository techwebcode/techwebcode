"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Container from "./Container";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import ToolsMegaMenu from "@/components/layout/ToolsMegaMenu";
import { useDynamicNavData } from "@/hooks/useDynamicNavData";

export default function Navbar() {
  const pathname = usePathname() || "/";

  const { categories, toolCategories } = useDynamicNavData();

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-command-search"));
  };

  const isHomeActive = pathname === "/";
  const isArticlesActive = pathname.startsWith("/articles");
  const isToolsActive = pathname.startsWith("/tools");
  const isCategoriesActive = pathname.startsWith("/categories");
  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <Container className="relative">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight shrink-0">
            <span className="text-blue-600">Tech</span>
            <span>WebCode</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main Navigation">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${isHomeActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                }`}
            >
              Home
            </Link>

            {/* Dynamic Tools Mega-Menu (PRIMARY FEATURE) */}
            <ToolsMegaMenu isActive={isToolsActive} categories={toolCategories} />

            {/* Playground Code Runner */}
            <Link
              href="/playground"
              className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 flex items-center gap-1.5 ${pathname.startsWith("/playground") ? "text-blue-600 font-semibold" : "text-muted-foreground"
                }`}
            >
              <span>Playground</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-wide">
                NEW
              </span>
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${isAboutActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${isContactActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Search Trigger with ⌘K Badge */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
              title="Search tools & compilers (⌘K)"
              aria-label="Search tools and code compilers (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Search tools...</span>
              <kbd className="inline-flex items-center text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleOpenSearch}
              className="sm:hidden"
              aria-label="Open Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="md:hidden">
              <MobileMenu />
            </div>

            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}