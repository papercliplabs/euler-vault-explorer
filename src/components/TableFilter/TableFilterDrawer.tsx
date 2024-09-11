"use client";
import { useShallowSearchParam } from "@/hooks/useShallowSearchParam";
import { FILTER_TOGGLE_KEY } from "./TableFilterToggle";
import clsx from "clsx";

export default function TableFilterDrawer() {
  const { value: open } = useShallowSearchParam({ name: FILTER_TOGGLE_KEY });
  return (
    <div
      className={clsx(
        "relative h-fit shrink-0 overflow-hidden rounded-3xl transition-all",
        open ? "left-0 mr-6 w-[292px] border" : "-left-full mr-0 w-0 border-0"
      )}
    >
      <div className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-medium">Filter Vaults</span>
        <span className="body-sm text-foreground-subtle">Clear all</span>
      </div>
      <div className="h-[200px]">TODO</div>
    </div>
  );
}
