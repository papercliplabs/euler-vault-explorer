import TooltipPopover from "./ui/tooltipPopover";
import { ReactNode } from "react";

interface MetricProps {
  title: string;
  popoverContent: ReactNode;
  primaryValue: string | ReactNode;
  secondaryValue?: string;
}

export default function Metric({ title, popoverContent, primaryValue, secondaryValue }: MetricProps) {
  return (
    <div className="text-foreground-muted flex w-full items-start justify-between gap-2 md:w-fit md:flex-col md:justify-start">
      <TooltipPopover trigger={title}>{popoverContent}</TooltipPopover>
      <div className="flex flex-col items-end md:items-start">
        <div className="text-foreground-base md:body-xl font-medium">{primaryValue}</div>
        {secondaryValue && <span className="body-sm">{secondaryValue}</span>}
      </div>
    </div>
  );
}
