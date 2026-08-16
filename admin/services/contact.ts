import api from "@/lib/axios";

export interface ContactMessageItem {
  id: number;
  name: string;
  email: string;
  reason: string;
  related_tool_id?: number;
  related_tool?: {
    id: number;
    name: string;
    slug: string;
  };
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "resolved" | "spam";
  ip_address: string;
  created_at: string;
  updated_at: string;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

class AdminContactService {
  async getContactMessages(params?: GetMessagesParams) {
    const response = await api.get("/admin/contact-messages", { params });
    return response.data;
  }

  async getContactMessage(id: number) {
    const response = await api.get(`/admin/contact-messages/${id}`);
    return response.data;
  }

  async updateContactStatus(id: number, status: string) {
    const response = await api.put(`/admin/contact-messages/${id}/status`, { status });
    return response.data;
  }

  async deleteContactMessage(id: number) {
    const response = await api.delete(`/admin/contact-messages/${id}`);
    return response.data;
  }
}

export default new AdminContactService();
