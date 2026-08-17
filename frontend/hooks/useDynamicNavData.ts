"use client";

import { useState, useEffect } from "react";
import categoryService from "@/services/category";
import toolService from "@/services/tool.service";
import { Category } from "@/types/category";
import { Tool } from "@/types/tools";
import {
  TOOL_NAV_CATEGORIES,
  ToolCategoryGroup,
  ToolNavItem,
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
          // Filter out inactive tools
          const activeTools = fetchedTools.filter(t => (t as any).status !== false);

          // Deduplicate tools based on canonical key
          const seenKeys = new Map<string, Tool>();
          activeTools.forEach((t) => {
            const key = t.slug
              .replace("-encoder-decoder", "")
              .replace("unix-timestamp-converter", "timestamp-converter")
              .toLowerCase();

            // Prefer cleaner/canonical slug
            if (!seenKeys.has(key) || t.slug.length < seenKeys.get(key)!.slug.length) {
              seenKeys.set(key, t);
            }
          });

          const uniqueTools = Array.from(seenKeys.values());

          // Dynamically map backend tools into navigation groups
          const groupMap: Record<string, ToolNavItem[]> = {};

          uniqueTools.forEach((t) => {
            const catName = t.category?.name || "General Tools";
            if (!groupMap[catName]) {
              groupMap[catName] = [];
            }
            groupMap[catName].push({
              id: t.id,
              name: t.name,
              slug: t.slug,
              href: `/tools/${t.slug}`,
              description: t.short_description || t.shortDescription || t.description || "",
              icon: t.icon,
              badge: (t.is_new || t.isNew) ? "NEW" : t.featured ? "FEATURED" : undefined,
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

