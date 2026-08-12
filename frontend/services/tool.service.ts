import api from "./api";
import { Tool, ToolCategory } from "@/types/tools";

class ToolService {
  async getTools(params?: Record<string, string | number | unknown>) {
    const response = await api.get<{ data?: Tool[]; success?: boolean }>("/tools", {
      params,
    });

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data ?? [];
  }

  async getFeaturedTools() {
    const response = await api.get<{ data?: Tool[] }>("/tools/featured");

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data ?? [];
  }

  async getTool(slug: string) {
    const response = await api.get<{ data?: Tool }>(`/tools/${slug}`);

    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    return data as unknown as Tool;
  }

  async getCategories() {
    const response = await api.get<{ data?: ToolCategory[] }>("/tools/categories");

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data ?? [];
  }
}

export default new ToolService();