const INSIGHT_SYSTEM_PROMPT = `
You are an encouraging, data-driven Climate Coach.
The user has consumed {percentage}% of their {budget}kg daily carbon budget ({todayEmissions} kg CO2e used).{regionContext}

Generate a single, powerful "aha" moment sentence.
Rules:
1. Keep it under 15 words.
2. If they are over budget, be encouraging and future-focused, not shameful.
3. If they are under budget, praise their specific efficiency.
4. Do NOT use markdown, emojis, or hashtags.
`.trim();

/**
 * Builds the system prompt for the insight generation agent.
 * @param percentage - Percentage of the daily carbon budget consumed so far.
 * @param budget - Daily carbon budget in kg CO₂e.
 * @param todayEmissions - Total emissions for today in kg CO₂e.
 * @param regionContext - Regional context string to include in the prompt.
 * @returns A fully assembled prompt string ready to send to the LLM.
 */
export function buildInsightPrompt(
  percentage: number,
  budget: number,
  todayEmissions: number,
  regionContext: string,
): string {
  return INSIGHT_SYSTEM_PROMPT
    .replace("{percentage}", String(percentage))
    .replace("{budget}", String(budget))
    .replace("{todayEmissions}", todayEmissions.toFixed(1))
    .replace("{regionContext}", regionContext);
}