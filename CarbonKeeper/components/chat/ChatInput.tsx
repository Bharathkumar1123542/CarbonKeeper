"use client";
import { Send } from "lucide-react";

/**
 * Props for the ChatInput component.
 * A text input form for sending messages to the AI chat assistant.
 */
interface ChatInputProps {
  /** Current input field value */
  input: string;
  /** State setter to update the input value */
  setInput: (value: string) => void;
  /** When true, the input is disabled and loading state is shown */
  isLoading: boolean;
  /** Form submit handler */
  handleSubmit: (e: React.FormEvent) => void;
  /** Ref to the underlying input element for programmatic focus */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  handleSubmit,
  inputRef,
}: ChatInputProps) {
  return (
    <div className="border-t border-hairline bg-surface-soft p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your carbon footprint..."
          disabled={isLoading}
          className="flex-1 px-5 py-3.5 rounded-xl bg-canvas border border-hairline text-body text-[15px] font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-shadow disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3.5 rounded-xl bg-brand-teal text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}