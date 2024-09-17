import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TooltipPopover from "./ui/tooltipPopover";
import { ReactNode } from "react";

interface MetricProps {
  title: string;
  popoverText: string;
  primaryValue: string | ReactNode;
  secondaryValue?: string;
}

export default function Metric({ title, popoverText, primaryValue, secondaryValue }: MetricProps) {
  return (
    <div className="text-foreground-muted flex w-full items-start justify-between gap-2 md:w-[180px] md:flex-col md:justify-start">
      <TooltipPopover trigger={title}>{popoverText}</TooltipPopover>
      <div className="flex flex-col items-end md:items-start">
        <div className="text-foreground-base md:body-xl font-medium">{primaryValue}</div>
        {secondaryValue && <span className="body-sm">{secondaryValue}</span>}
      </div>
    </div>
  );
}
