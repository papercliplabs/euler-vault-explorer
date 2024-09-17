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
      <Tooltip delayDuration={500}>
        <TooltipTrigger
          className={clsx(
            "hidden w-fit md:flex",
            typeof trigger == "string" && "border-border-strong border-b border-dashed"
          )}
        >
          {trigger}
        </TooltipTrigger>
        <TooltipContent className="hidden w-fit md:flex">{children}</TooltipContent>
      </Tooltip>
      <Popover>
        <PopoverTrigger
          className={clsx(
            "w-fit md:hidden",
            typeof trigger == "string" && "border-border-strong border-b border-dashed"
          )}
        >
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-fit md:hidden">{children}</PopoverContent>
      </Popover>
    </>
  );
}
