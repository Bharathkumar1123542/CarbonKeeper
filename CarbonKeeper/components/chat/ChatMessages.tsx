"use client";
import { Bot, User } from "lucide-react";

/**
 * Props for the ChatMessages component.
 * Renders a list of chat messages with distinct styles for user and assistant roles.
 */
interface ChatMessagesProps {
  /** Array of message objects, each with a role and content string */
  messages: { role: "user" | "assistant"; content: string }[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-6">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "assistant"
                ? "bg-brand-teal text-white"
                : "bg-ink text-white"
            }`}
          >
            {msg.role === "assistant" ? (
              <Bot className="w-5 h-5" aria-hidden="true" />
            ) : (
              <User className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <div
            className={`max-w-[75%] rounded-2xl px-5 py-3 ${
              msg.role === "assistant"
                ? "bg-surface-soft border border-hairline text-ink"
                : "bg-brand-teal text-white"
            }`}
          >
            <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
              {msg.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}