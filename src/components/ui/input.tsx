import * as React from "react";

import { cn } from "@/utils/shadcn";
import { Search } from "../Icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <div
      className={cn(
        "bg-background-field body-sm flex h-10 w-full items-center rounded-[12px] px-3",
        "ring-offset-semantic-accent focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2",
        className
      )}
    >
      <Search className="stroke-foreground-muted" />
      <input
        type={type}
        className={cn(
          "placeholder:text-foreground-muted grow",
          "bg-transparent focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };
