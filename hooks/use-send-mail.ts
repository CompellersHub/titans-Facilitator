import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";


export interface SendMailPayload {
  student_email: string[];
  subject: string;
  message: string;
  teacher_name: string;
  teacher_email: string;
}

export function useSendMail() {
  return useMutation({
    mutationFn: async (payload: SendMailPayload) => {
      return apiClient.post("/customuser/teacher/email/", payload);
    },
  });
}
