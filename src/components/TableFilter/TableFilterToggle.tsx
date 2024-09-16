"use client";
import clsx from "clsx";
import { ArrowLeft, Settings } from "../Icons";
import { Button } from "../ui/button";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { ALL_TABLE_FILTER_KEYS, FILTER_KEY_OPEN } from "./filterKeys";

export default function TableFilterToggle() {
  const {
    values: [[open], ...rest],
    addShallowSearchParams,
    removeShallowSearchParams,
  } = useShallowSearchParams({ keys: [FILTER_KEY_OPEN, ...ALL_TABLE_FILTER_KEYS] });

  const filterCount = rest.reduce((acc, filterList) => acc + (filterList?.length ?? 0), 0);

  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-[12px] transition-all"
      onClick={() => {
        open
          ? removeShallowSearchParams([FILTER_KEY_OPEN])
          : addShallowSearchParams([{ key: FILTER_KEY_OPEN, value: "1" }]);
      }}
    >
      <div className="relative">
        <ArrowLeft
          className={clsx("stroke-foreground-muted absolute transition-opacity", open ? "opacity-100" : "opacity-0")}
        />
        <Settings className={clsx("transition-opacity", open ? "opacity-0" : "opacity-100")} />
      </div>
      <span className="hidden md:block">Filters</span>
      <div className="body-xs bg-background-base flex h-[20px] min-w-[20px] items-center justify-center rounded-full font-medium">
        {filterCount}
      </div>
    </Button>
  );
}
