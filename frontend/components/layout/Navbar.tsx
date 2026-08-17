"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import Container from "./Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "@/components/layout/MobileMenu";
import ToolsMegaMenu from "@/components/layout/ToolsMegaMenu";
import NavDropdown from "@/components/layout/NavDropdown";
import { ARTICLE_DROPDOWN_ITEMS } from "@/constants/navigationData";
import { useDynamicNavData } from "@/hooks/useDynamicNavData";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const { categories, toolCategories } = useDynamicNavData();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isHomeActive = pathname === "/";
  const isArticlesActive = pathname.startsWith("/articles");
  const isToolsActive = pathname.startsWith("/tools");
  const isCategoriesActive = pathname.startsWith("/categories");
  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Tech</span>
            <span>WebCode</span>
          </Link>

          {/* Search Bar Inline Input when toggled */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md mx-4">
              <Input
                autoFocus
                type="text"
                placeholder="Search articles and developer tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-xl text-sm"
              />
              <Button type="submit" size="sm" className="h-9 rounded-xl">
                Search
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchOpen(false)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-5 md:flex" aria-label="Main Navigation">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${
                    isHomeActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                  }`}
                >
                  Home
                </Link>

                {/* Dynamic Tools Mega-Menu (PRIMARY FEATURE) */}
                <ToolsMegaMenu isActive={isToolsActive} categories={toolCategories} />

                {/* Articles Dropdown (SECONDARY) */}
                <NavDropdown
                  title="Articles"
                  isActive={isArticlesActive}
                  items={ARTICLE_DROPDOWN_ITEMS}
                  widthClass="w-80"
                />

                {/* Dynamic Categories Dropdown */}
                <NavDropdown
                  title="Categories"
                  isActive={isCategoriesActive}
                  items={categories}
                  widthClass="w-80"
                  isCategoryGrid
                />

                <Link
                  href="/about"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${
                    isAboutActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 rounded-lg px-2 py-2 ${
                    isContactActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
                  }`}
                >
                  Contact
                </Link>
              </nav>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open Search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                <div className="md:hidden">
                  <MobileMenu />
                </div>

                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}