"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Wrench, BookOpen, FolderKanban } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ARTICLE_DROPDOWN_ITEMS } from "@/constants/navigationData";
import { useDynamicNavData } from "@/hooks/useDynamicNavData";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    tools: true,
    articles: false,
    categories: false,
  });

  const pathname = usePathname();
  const { categories, toolCategories } = useDynamicNavData();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation menu</span>
      </SheetTrigger>

      <SheetContent side="left" className="w-[310px] sm:w-[350px] p-6 overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-left font-bold text-xl tracking-tight">
            <span className="text-blue-600">Tech</span>
            <span>WebCode</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile Navigation">
          {/* Home */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
          >
            Home
          </Link>

          {/* Tools Accordion (PRIMARY NAV ITEM - OPEN BY DEFAULT) */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleAccordion("tools")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>Developer Tools</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white font-extrabold text-[9px] uppercase">
                  Catalog
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openAccordions.tools ? "rotate-180" : ""
                }`}
              />
            </button>

            {openAccordions.tools && (
              <div className="pl-3 space-y-3 py-2 border-l-2 border-blue-500/40 ml-3">
                {toolCategories.map((catGroup) => (
                  <div key={catGroup.title} className="space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                      {catGroup.title}
                    </div>
                    {catGroup.tools.map((t) => (
                      <Link
                        key={t.slug}
                        href={t.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-foreground hover:text-blue-600 hover:bg-muted/50 transition-colors"
                      >
                        <span className="truncate">{t.name}</span>
                        {t.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              t.badge === "NEW"
                                ? "bg-rose-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {t.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ))}

                <Link
                  href="/tools"
                  onClick={() => setIsOpen(false)}
                  className="block p-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Tools →
                </Link>
              </div>
            )}
          </div>

          {/* Articles Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleAccordion("articles")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>Articles & Guides</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openAccordions.articles ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {openAccordions.articles && (
              <div className="pl-4 space-y-1 py-1 border-l-2 border-border ml-3">
                {ARTICLE_DROPDOWN_ITEMS.map((art) => (
                  <Link
                    key={art.href}
                    href={art.href}
                    onClick={() => setIsOpen(false)}
                    className="block p-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-blue-600 hover:bg-muted/50 transition-colors"
                  >
                    {art.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => toggleAccordion("categories")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-muted-foreground" />
                <span>Categories</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openAccordions.categories ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {openAccordions.categories && (
              <div className="pl-4 grid grid-cols-2 gap-1 py-1 border-l-2 border-border ml-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-blue-600 hover:bg-muted/50 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
          >
            About
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}