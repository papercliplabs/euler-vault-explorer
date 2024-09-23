import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import clsx from "clsx";

interface TooltipPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
}

export default function TooltipPopover({ trigger, children }: TooltipPopoverProps) {
  return (
    <>
      <Tooltip delayDuration={200}>
        <TooltipTrigger
          className={clsx(
            "hidden w-fit text-start md:flex",
            typeof trigger == "string" && "border-border-strong hocus:border-foreground-muted border-b border-dashed"
          )}
        >
          {trigger}
        </TooltipTrigger>
        <TooltipContent className="hidden w-fit max-w-[min(95dvw,400px)] md:flex">{children}</TooltipContent>
      </Tooltip>
      <Popover>
        <PopoverTrigger
          className={clsx(
            "w-fit text-start md:hidden",
            typeof trigger == "string" && "border-border-strong hocus:border-foreground-muted border-b border-dashed"
          )}
        >
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-fit max-w-[min(95dvw,400px)] md:hidden">{children}</PopoverContent>
      </Popover>
    </>
  );
}
