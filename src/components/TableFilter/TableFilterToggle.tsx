"use client";
import clsx from "clsx";
import { ArrowLeft, Settings } from "../Icons";
import { Button } from "../ui/button";
import { useShallowSearchParam } from "@/hooks/useShallowSearchParam";

export const FILTER_TOGGLE_KEY = "filtersOpen";

export default function TableFilterToggle() {
  const {
    value: open,
    addShallowSearchParam,
    removeShallowSearchParam,
  } = useShallowSearchParam({ name: FILTER_TOGGLE_KEY });

  return (
    <Button
      variant="secondary"
      size="lg"
      className="rounded-xl transition-all"
      onClick={() => {
        open ? removeShallowSearchParam(FILTER_TOGGLE_KEY) : addShallowSearchParam(FILTER_TOGGLE_KEY, "1");
      }}
    >
      <div className="relative">
        <ArrowLeft
          className={clsx("stroke-foreground-muted absolute transition-opacity", open ? "opacity-100" : "opacity-0")}
        />
        <Settings className={clsx("transition-opacity", open ? "opacity-0" : "opacity-100")} />
      </div>
      Filters
    </Button>
  );
}
