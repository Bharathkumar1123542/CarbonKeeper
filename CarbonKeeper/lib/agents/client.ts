import { GoogleGenAI } from "@google/genai";

/**
 * Creates a Google Generative AI client instance.
 * @param apiKeyOverride - Optional API key to override the environment variable
 * @returns GoogleGenAI client instance configured with the provided or environment API key
 */
export const getAIClient = (apiKeyOverride?: string) => {
  return new GoogleGenAI({
    apiKey: apiKeyOverride || process.env.GEMINI_API_KEY,
  });
};

/**
 * Safely generates JSON content using the AI model.
 * @param ai - GoogleGenAI client instance
 * @param prompt - The prompt to send to the model
 * @returns Promise resolving to the generated text as a string, or null if generation fails
 */
export async function generateContentSafe(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return response.text || null;
  } catch {
    return null;
  }
}

/**
 * Safely generates text content using the AI model.
 * @param ai - GoogleGenAI client instance
 * @param prompt - The prompt to send to the model
 * @returns Promise resolving to the generated text as a string, or null if generation fails
 */
export async function generateTextSafe(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });
    return response.text || null;
  } catch {
    return null;
  }
}
