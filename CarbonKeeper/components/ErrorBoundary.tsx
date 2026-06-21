"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Props for the ErrorBoundary component.
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
interface Props {
  /** Child components to wrap with error boundary protection */
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[400px] flex items-center justify-center bg-canvas"
          role="alert"
        >
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="w-12 h-12 text-brand-pink mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-[24px] font-semibold text-ink mb-2">
              Something went wrong
            </h2>
            <p className="text-muted font-medium text-[15px] mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-[15px] hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
