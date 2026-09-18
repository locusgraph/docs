import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site/seo";
import "./globals.css";

/**
 * The root layout every route on the docs host renders inside.
 *
 * The two font variables are what `theme.css` reads for `--font-sans` and
 * `--font-mono`; without them the typeset falls back to the system stack and
 * the docs stop matching the dashboard.
 *
 * `metadataBase` lives here and nowhere else: `pageMeta` sets
 * `alternates.canonical` and `og:url` as site-relative paths, and Next resolves
 * them against this. Without it, canonicals ship relative and a crawler is left
 * to guess the host.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LocusGraph Docs", template: "%s" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
