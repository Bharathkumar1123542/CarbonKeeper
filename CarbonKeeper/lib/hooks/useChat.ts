"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Activity, ChatMessage } from "@/lib/types";
import { sendChatMessage } from "@/lib/services/chat-service";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "I'm your AI Climate Assistant. I can answer questions about your logged activities and help you understand your carbon footprint. What would you like to know?",
};

interface UseChatOptions {
  activities: Activity[];
}

/**
 * Custom React hook for managing an AI chat conversation about the user's carbon footprint.
 * Handles message state, input, loading state, and sending messages via the chat service.
 * @param options - Configuration object containing the user's activity list.
 * @returns An object with messages, input state, refs, and action handlers for the chat UI.
 */
export function useChat({ activities }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await sendChatMessage(message, activities);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I encountered an error. Please check your API key or try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [activities, isLoading],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    inputRef,
    sendMessage,
    handleSubmit,
  };
}
