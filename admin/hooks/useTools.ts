"use client";

import { useQuery } from "@tanstack/react-query";
import { getTools } from "@/api/tool";

export function useToolOptions() {
    return useQuery({
        queryKey: ["tool-options"],
        queryFn: async () => {
            const response = await getTools(1, 1000, "");
            return response.data;
        },
    });
}
