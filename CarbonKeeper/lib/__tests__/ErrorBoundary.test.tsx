import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../components/ErrorBoundary";

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("renders error UI when a child throws", () => {
    const ThrowingComponent = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred. Please try refreshing the page.")).toBeInTheDocument();
  });

  it("renders a refresh button on error", () => {
    const ThrowingComponent = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Refresh Page")).toBeInTheDocument();
  });

  it("refresh button has role alert on error container", () => {
    const ThrowingComponent = () => {
      throw new Error("Test error");
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );
    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).toBeInTheDocument();
  });
});
