"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ChatbotButton() {
  return (
    <Button
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
      size="icon"
      onClick={() => {
        // Add your chatbot open logic here
        console.log("Open chatbot");
      }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open chat</span>
    </Button>
  );
}
