import { create } from "zustand";
import type { Recommendation, Challenge } from "@/lib/types";
import { CHALLENGES } from "@/lib/constants/challenges";

/**
 * State interface for the AI store.
 * @property recommendations - List of AI-generated recommendations
 * @property challenges - List of carbon-reduction challenges with completion state
 * @property insight - Current AI-generated insight text, or null if none
 * @property isProcessing - Whether an AI request is currently in progress
 * @property setRecommendations - Updates the recommendations list
 * @property setInsight - Updates the current insight text
 * @property setIsProcessing - Sets the processing status
 * @property toggleChallenge - Toggles a challenge's active state and updates streak
 */
interface AIState {
  recommendations: Recommendation[];
  challenges: Challenge[];
  insight: string | null;
  isProcessing: boolean;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
  setIsProcessing: (status: boolean) => void;
  toggleChallenge: (id: string) => void;
}

const initialChallenges: Challenge[] = CHALLENGES.map((challenge) => ({
  ...challenge,
  active: false,
  streak: 0,
  completed: false,
}));

/**
 * Zustand store for managing AI-generated content and challenges.
 * Handles recommendations, insights, and carbon-reduction challenge state.
 * @returns A Zustand store hook for accessing and modifying AI state
 */
export const useAIStore = create<AIState>((set) => ({
  recommendations: [],
  challenges: initialChallenges,
  insight: null,
  isProcessing: false,

  setRecommendations: (recs) => set({ recommendations: recs }),
  setInsight: (insight) => set({ insight }),
  setIsProcessing: (status) => set({ isProcessing: status }),

  toggleChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, active: !challenge.active, streak: !challenge.active ? challenge.streak + 1 : challenge.streak }
          : challenge,
      ),
    })),
}));