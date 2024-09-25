"use client";

import * as React from "react";

import { cn } from "@/utils/shadcn";

interface ControlledSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked: boolean;
}

export default function ControlledSwitch({ checked, className, ...props }: ControlledSwitchProps) {
  return (
    <div
      className={cn(
        "group peer inline-flex h-[16px] w-[28px] shrink-0 cursor-pointer items-center rounded-full border-2 border-red-600 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-[#2AE5B933]/20" : "bg-background-field",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-full shadow-lg ring-0 transition-transform",
          checked ? "bg-semantic-accent translate-x-3" : "bg-euler-700 group-hover:bg-euler-800 translate-x-0"
        )}
      />
    </div>
  );
}

export { ControlledSwitch };
