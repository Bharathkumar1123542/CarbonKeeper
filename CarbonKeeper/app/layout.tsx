import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CarbonKeeper — Understand, Track, and Reduce Your Carbon Footprint",
  description: "AI-powered personal carbon coach. Log activities naturally, get instant CO₂ calculations, personalized reduction plans, and track your impact over time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-canvas text-body antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-6 focus:py-3 focus:bg-primary focus:text-on-primary focus:rounded-xl focus:font-bold focus:text-[16px]"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <main id="main-content">{children}</main>
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
