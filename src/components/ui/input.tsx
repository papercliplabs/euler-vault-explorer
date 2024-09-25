"use client";
import * as React from "react";

import { cn } from "@/utils/shadcn";
import { Search } from "../Icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  // Create a local ref to the input element if ref is not provided
  const internalRef = React.useRef<HTMLInputElement>(null);
  const combinedRef = ref || internalRef;

  return (
    <div
      className={cn(
        "bg-background-field body-lg md:body-md hover:bg-euler-600 flex h-10 w-full shrink-0 cursor-text items-center gap-2 rounded-[12px] border px-3",
        "ring-offset-semantic-accent overflow-hidden text-ellipsis whitespace-nowrap focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2",
        className
      )}
      onClick={() => {
        if (combinedRef && typeof combinedRef !== "function") {
          combinedRef.current?.focus();
        }
      }}
    >
      <Search className="stroke-foreground-muted h-[15px] w-[15px] p-0" />
      <input
        type={type}
        className={cn(
          "placeholder:text-foreground-muted grow",
          "bg-transparent focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        ref={combinedRef}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };
