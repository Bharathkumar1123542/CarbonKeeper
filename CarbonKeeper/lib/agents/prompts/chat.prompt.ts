/**
 * Builds the system prompt for the conversational chat agent.
 * @param activitiesContext - Formatted string of the user's recent activities.
 * @param totalEmissions - Total emissions across all logged activities in kg CO₂e.
 * @param activityCount - Number of activities the user has logged.
 * @param message - The user's current chat message.
 * @returns A fully assembled prompt string ready to send to the LLM.
 */
export function buildChatPrompt(
  activitiesContext: string,
  totalEmissions: number,
  activityCount: number,
  message: string,
): string {
  return `
You are CarbonKeeper's AI Climate Assistant. You help users understand their carbon footprint data.

The user has logged the following activities (showing up to 30 most recent):
${activitiesContext}

Total logged emissions: ${totalEmissions.toFixed(1)} kg CO₂e across ${activityCount} activities.

Rules:
1. Only reference data from the provided activities. Never fabricate numbers.
2. Be encouraging, specific, and non-judgmental.
3. Keep responses concise — under 150 words.
4. If asked about something not in their data, politely say you can only answer based on their logged activities.
5. Do not use markdown, emojis, or hashtags.

User's question: ${message}
`.trim();
}
