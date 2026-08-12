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
import { NAVIGATION } from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

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
                placeholder="Search articles and tools..."
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
              <nav className="hidden items-center gap-8 md:flex">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === item.href ? "text-blue-600 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
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