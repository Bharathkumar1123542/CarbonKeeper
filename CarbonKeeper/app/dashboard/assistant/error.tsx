"use client";
import { AlertTriangle } from "lucide-react";

export default function AssistantError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="h-full flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-brand-pink" aria-hidden="true" />
        </div>
        <h2 className="text-[24px] font-semibold text-ink mb-3">
          Something went wrong
        </h2>
        <p className="text-muted font-medium mb-8">
          The AI Assistant encountered an error. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-on-primary font-bold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
