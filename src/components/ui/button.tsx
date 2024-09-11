import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/shadcn";
import clsx from "clsx";

const buttonVariants = cva(
  clsx(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full body-md font-medium transition-colors gap-1.5",
    "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:bg-background-base disabled:text-foreground-disabled"
  ),
  {
    variants: {
      variant: {
        primary: "bg-semantic-accent hover:bg-teal-1000 text-euler-100",
        secondary: "bg-euler-500 border hover:bg-euler-600 hover:border-border-strong",
      },
      size: {
        sm: "h-[32px] px-3 py-1.5",
        lg: "h-[40px] px-3 py-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
