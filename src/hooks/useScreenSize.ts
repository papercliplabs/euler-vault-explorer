"use client";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type ScreenSize = "sm" | "md" | "lg";

export function useScreenSize(defaultSize?: ScreenSize): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(defaultSize ?? "lg");

  const md = useMediaQuery(`(min-width: ${tailwindFullTheme.theme.screens.md})`);
  const lg = useMediaQuery(`(min-width: ${tailwindFullTheme.theme.screens.lg})`);

  useEffect(() => {
    setScreenSize(lg ? "lg" : md ? "md" : "sm");
  }, [md, lg]);

  return screenSize;
}
