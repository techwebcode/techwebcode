"use client";

import { useState, useEffect } from "react";
import categoryService from "@/services/category";
import toolService from "@/services/tool.service";
import { Category } from "@/types/category";
import { Tool } from "@/types/tools";
import {
  TOOL_NAV_CATEGORIES,
  ToolCategoryGroup,
} from "@/constants/navigationData";

export interface NavCategoryItem {
  name: string;
  href: string;
}

export function useDynamicNavData() {
  const [categories, setCategories] = useState<NavCategoryItem[]>([]);
  const [toolCategories, setToolCategories] = useState<ToolCategoryGroup[]>(TOOL_NAV_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicData() {
      try {
        // Fetch Categories dynamically from Backend API
        const catRes = await categoryService.getCategories({ limit: 50 });
        const fetchedCats: Category[] = Array.isArray(catRes)
          ? catRes
          : catRes?.data || [];

        if (isMounted && fetchedCats.length > 0) {
          const mappedCats: NavCategoryItem[] = fetchedCats.map((c) => ({
            name: c.name,
            href: `/categories/${c.slug}`,
          }));
          setCategories(mappedCats);
        }

        // Fetch Tools dynamically from Backend API
        const fetchedTools: Tool[] = await toolService.getTools();
        if (isMounted && Array.isArray(fetchedTools) && fetchedTools.length > 0) {
          // Dynamically map backend tools into navigation groups
          const groupMap: Record<string, any[]> = {};

          fetchedTools.forEach((t) => {
            const catName = t.category?.name || "General Tools";
            if (!groupMap[catName]) {
              groupMap[catName] = [];
            }
            groupMap[catName].push({
              name: t.name,
              slug: t.slug,
              href: `/tools/${t.slug}`,
              description: t.short_description || t.description || "",
              icon: t.icon,
              badge: t.is_new ? "NEW" : t.featured ? "FEATURED" : undefined,
            });
          });

          // Convert to ToolCategoryGroup[]
          const dynamicToolGroups: ToolCategoryGroup[] = Object.entries(groupMap).map(
            ([title, tools]) => ({
              title,
              tools,
            })
          );

          if (dynamicToolGroups.length > 0) {
            setToolCategories(dynamicToolGroups);
          }
        }
      } catch (err) {
        // Handle error silently
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDynamicData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    toolCategories,
    isLoading,
  };
}
