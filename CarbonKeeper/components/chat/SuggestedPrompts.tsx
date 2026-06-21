"use client";

const SUGGESTED_PROMPTS = [
  "What's my biggest source of emissions?",
  "How can I reduce my carbon footprint?",
  "Break down my transport emissions",
  "What does my food consumption look like?",
  "Am I on track with my daily budget?",
];

/**
 * Props for the SuggestedPrompts component.
 * Shows clickable prompt suggestions for new chat users.
 */
interface SuggestedPromptsProps {
  /** Callback invoked when a suggested prompt is clicked */
  onSendMessage: (prompt: string) => void;
  /** Array-like object of logged activities (uses .length to check if any exist) */
  activities: { length: number };
  /** Array-like object of chat messages (uses .length to determine visibility) */
  messages: { length: number };
}

export function SuggestedPrompts({
  onSendMessage,
  activities,
  messages,
}: SuggestedPromptsProps) {
  if (activities.length === 0 || messages.length > 1) return null;

  return (
    <div className="mb-8">
      <p className="text-[13px] font-bold text-muted uppercase tracking-wider mb-3">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            className="px-4 py-2 rounded-xl bg-surface-soft border border-hairline text-[14px] font-semibold text-ink hover:bg-hairline transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}