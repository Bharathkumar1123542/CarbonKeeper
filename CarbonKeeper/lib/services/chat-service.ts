import type { Activity } from "@/lib/types";

/**
 * Sends a chat message and the user's activity history to the /api/chat endpoint.
 * @param message - The user's message text.
 * @param history - The user's logged activities for context.
 * @returns The AI assistant's response text, or a fallback error message.
 */
export async function sendChatMessage(
  message: string,
  history: Activity[],
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  return data.response || "Sorry, I couldn't process that request.";
}
