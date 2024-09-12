"use client";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { cn } from "@/utils/shadcn";
import { HTMLAttributes } from "react";

interface TableFilterClearButtonProps extends HTMLAttributes<HTMLButtonElement> {
  filterKeys: string[];
}

export default function FilterClearButton({ filterKeys, className, ...props }: TableFilterClearButtonProps) {
  const { removeShallowSearchParams } = useShallowSearchParams({ keys: [] });

  return (
    <button
      onClick={() => removeShallowSearchParams(filterKeys)}
      className={cn("text-foreground-subtle hover:text-foreground-base", className)}
      {...props}
    />
  );
}
