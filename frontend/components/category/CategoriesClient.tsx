"use client";

import { useState } from "react";
import CategoryGrid from "@/components/category/CategoryGrid";
import { Input } from "@/components/ui/input";
import { Search, FolderX } from "lucide-react";
import { Category } from "@/types/category";

interface Props {
  initialCategories: (Category & { article_count?: number })[];
}

export default function CategoriesClient({ initialCategories }: Readonly<Props>) {
  const [search, setSearch] = useState("");

  const filteredCategories = initialCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 rounded-xl"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-12 text-center text-muted-foreground space-y-2">
          <FolderX className="w-8 h-8 mx-auto text-muted-foreground/60" />
          <h4 className="font-bold text-foreground">No Categories Found</h4>
          <p className="text-xs">No categories matching &quot;{search}&quot; were found.</p>
        </div>
      ) : (
        <CategoryGrid categories={filteredCategories} />
      )}
    </div>
  );
}
