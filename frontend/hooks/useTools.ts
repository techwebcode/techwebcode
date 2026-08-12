import { useQuery } from "@tanstack/react-query";
import ToolService from "@/services/tool.service";

export function useTools(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["tools", filters],
    queryFn: () => ToolService.getTools(filters),
  });
}

export function useFeaturedTools() {
  return useQuery({
    queryKey: ["featured-tools"],
    queryFn: () => ToolService.getFeaturedTools(),
  });
}

export function useTool(slug: string) {
  return useQuery({
    queryKey: ["tool", slug],
    queryFn: () => ToolService.getTool(slug),
    enabled: !!slug,
  });
}

export function useToolCategories() {
  return useQuery({
    queryKey: ["tool-categories"],
    queryFn: () => ToolService.getCategories(),
  });
}