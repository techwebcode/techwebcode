import api from "./api";

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  reason: string;
  related_tool_id?: number | null;
  subject: string;
  message: string;
  website_url_hp?: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
  };
}

class ContactService {
  async submitContactForm(payload: ContactSubmissionPayload): Promise<ContactSubmissionResponse> {
    const response = await api.post<ContactSubmissionResponse>("/contact", payload);
    return response.data;
  }
}

export default new ContactService();
