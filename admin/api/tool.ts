import api from "@/lib/axios";
import { ToolListResponse } from "@/types/tool";

export async function getTools(page = 1, limit = 1000, search = "") {
    const response = await api.get<ToolListResponse>(
        `/tools?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
}
