"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, BarChart2, Settings, Menu, X, MessageCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: Home, label: "Track Activities" },
    { href: "/dashboard/logs", icon: List, label: "Understand Logs" },
    { href: "/dashboard/insights", icon: BarChart2, label: "Reduce Carbon" },
    { href: "/dashboard/assistant", icon: MessageCircle, label: "AI Assistant" },
  ];

  return (
    <div className="flex min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white relative">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setIsMobileOpen(false); }}
          role="presentation"
          tabIndex={-1}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface-soft border-r border-hairline flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <Link
            href="/"
            className="text-[20px] font-semibold text-ink tracking-tight flex items-center gap-2"
          >
            CarbonKeeper
          </Link>
          <button
            className="md:hidden text-ink"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive
                    ? "bg-canvas text-ink shadow-sm border border-hairline"
                    : "text-muted hover:bg-surface-card hover:text-ink border border-transparent"
                }`}
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-hairline">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-canvas text-ink shadow-sm border border-hairline"
                : "text-muted hover:bg-surface-card hover:text-ink border border-transparent"
            }`}
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
            Settings
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden p-4 border-b border-hairline bg-surface-soft flex items-center justify-between">
          <Link
            href="/"
            className="text-[18px] font-semibold text-ink tracking-tight flex items-center gap-2"
          >
            CarbonKeeper
          </Link>
          <button
            className="text-ink"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
