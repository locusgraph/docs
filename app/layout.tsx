import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site/seo";
import "./globals.css";

/**
 * The root layout every route on the docs host renders inside.
 *
 * No font loader here. The LocusGraph theme brings IBM Plex Sans, IBM Plex
 * Mono and Archivo itself, as self-hosted `@font-face` rules imported by
 * `globals.css`, so every product that takes the theme sets the same type.
 *
 * `metadataBase` lives here and nowhere else: `pageMeta` sets
 * `alternates.canonical` and `og:url` as site-relative paths, and Next resolves
 * them against this. Without it, canonicals ship relative and a crawler is left
 * to guess the host.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LocusGraph Docs", template: "%s" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
