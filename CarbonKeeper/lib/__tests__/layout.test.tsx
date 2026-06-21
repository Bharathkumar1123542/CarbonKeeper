import { render, screen, fireEvent } from "@testing-library/react";
import DashboardLayout from "../../app/dashboard/layout";

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("lucide-react", () => ({
  Home: () => <span>HomeIcon</span>,
  List: () => <span>ListIcon</span>,
  BarChart2: () => <span>BarChart2Icon</span>,
  MessageCircle: () => <span>MessageCircleIcon</span>,
  Settings: () => <span>SettingsIcon</span>,
  Menu: () => <span>MenuIcon</span>,
  X: () => <span>XIcon</span>,
}));

describe("DashboardLayout", () => {
  it("renders sidebar with navigation links", () => {
    render(
      <DashboardLayout>
        <div>Page content</div>
      </DashboardLayout>,
    );
    expect(screen.getByText("Track Activities")).toBeInTheDocument();
    expect(screen.getByText("Understand Logs")).toBeInTheDocument();
    expect(screen.getByText("Reduce Carbon")).toBeInTheDocument();
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DashboardLayout>
        <div>Page content</div>
      </DashboardLayout>,
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("highlights active nav link", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );
    const overview = screen.getByText("Track Activities").closest("a");
    expect(overview?.className).toContain("shadow-sm");
  });

  it("shows mobile menu button", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("opens mobile menu when hamburger is clicked", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );
    fireEvent.click(screen.getByLabelText("Open menu"));
    // backdrop overlay appears
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("closes mobile menu overlay when backdrop is clicked", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );
    fireEvent.click(screen.getByLabelText("Open menu"));
    const backdrop = document.querySelector(".fixed.inset-0");
    expect(backdrop).toBeInTheDocument();
    // clicking overlay backdrop closes the menu
    fireEvent.click(backdrop!);
    expect(document.querySelector(".fixed.inset-0")).not.toBeInTheDocument();
  });

  it("renders brand logo link twice (sidebar + mobile header)", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );
    const brands = screen.getAllByText("CarbonKeeper");
    expect(brands).toHaveLength(2);
    brands.forEach((brand) => {
      expect(brand.closest("a")).toHaveAttribute("href", "/");
    });
  });
});
