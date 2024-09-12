"use client";
import clsx from "clsx";
import { ArrowLeft, Settings } from "../Icons";
import { Button } from "../ui/button";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { FILTER_KEY_OPEN } from "./filterKeys";

export default function TableFilterToggle() {
  const {
    values: [[open]],
    addShallowSearchParams,
    removeShallowSearchParams,
  } = useShallowSearchParams({ keys: [FILTER_KEY_OPEN] });

  return (
    <Button
      variant="secondary"
      size="lg"
      className="rounded-xl transition-all"
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
      Filters
    </Button>
  );
}
