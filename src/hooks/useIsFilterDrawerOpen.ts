"use client";
import { FILTER_KEY_OPEN } from "@/components/TableFilter/filterKeys";
import { useShallowSearchParams } from "./useShallowSearchParams";
import { useScreenSize } from "./useScreenSize";
import { useMemo } from "react";

export function useIsFilterDrawerOpen(): boolean {
  const screenSize = useScreenSize("sm");
  const {
    values: [toggleKey],
  } = useShallowSearchParams({ keys: [FILTER_KEY_OPEN] });

  // Defaults open
  const isOpen = useMemo(() => {
    const value: string | undefined = toggleKey[0];

    // Default state, closed on mobile otherwise open
    if (value == undefined) {
      return screenSize != "sm";
    } else {
      return value == "1";
    }
  }, [toggleKey, screenSize]);

  return isOpen;
}
