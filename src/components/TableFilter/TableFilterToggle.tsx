"use client";
import clsx from "clsx";
import { ArrowLeft, Settings } from "../Icons";
import { Button } from "../ui/button";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { ALL_TABLE_FILTER_KEYS, FILTER_KEY_OPEN } from "./filterKeys";
import { useMemo } from "react";
import { useIsFilterDrawerOpen } from "@/hooks/useIsFilterDrawerOpen";

export default function TableFilterToggle() {
  const {
    values: [vals],
    addShallowSearchParams,
  } = useShallowSearchParams({ keys: ALL_TABLE_FILTER_KEYS });

  const open = useIsFilterDrawerOpen();

  const filterCount = vals.reduce((acc, filterList) => acc + (filterList?.length ?? 0), 0);

  return (
    <Button
      variant="secondary"
      size="lg"
      className="rounded-[12px] transition-all"
      onClick={() => {
        open
          ? addShallowSearchParams([{ key: FILTER_KEY_OPEN, value: "0" }])
          : addShallowSearchParams([{ key: FILTER_KEY_OPEN, value: "1" }]);
      }}
    >
      <div className="relative">
        <ArrowLeft
          className={clsx(
            "stroke-foreground-muted absolute h-[15px] w-[15px] p-0 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <Settings className={clsx("h-[15px] w-[15px] p-0 transition-opacity", open ? "opacity-0" : "opacity-100")} />
      </div>
      <span className="hidden md:block">Filters</span>
      <div className="body-xs bg-background-base flex h-[20px] min-w-[20px] items-center justify-center rounded-full font-medium">
        {filterCount}
      </div>
    </Button>
  );
}
