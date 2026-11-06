"use client";

import { ThemeToggle } from "@locusgraph/components";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * The LocusGraph theme toggle, driven by `next-themes`.
 *
 * `next-themes` owns the `.dark` class on `<html>`, which is what the theme's
 * dark palette keys off, so the toggle only has to report a choice and read the
 * resolved one back.
 *
 * It renders a placeholder the toggle's size until mounted. The system
 * preference is only known on the client, so reading `resolvedTheme` during the
 * server render would draw one state and swap it on hydration.
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className="size-control-sm" aria-hidden />;

  return (
    <ThemeToggle theme={resolvedTheme === "dark" ? "dark" : "light"} onThemeChange={setTheme} />
  );
}
