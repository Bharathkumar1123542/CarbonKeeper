"use client";
import { Bot } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0">
        <Bot className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="bg-surface-soft border border-hairline rounded-2xl px-5 py-3">
        <div className="flex gap-1.5">
          <span
            className="w-2 h-2 bg-muted rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-muted rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-muted rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
      </div>
    </div>
  );
}