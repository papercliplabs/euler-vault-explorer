import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MetricProps {
  title: string;
  popoverText: string;
  primaryValue: string;
  secondaryValue?: string;
}

export default function Metric({ title, popoverText, primaryValue, secondaryValue }: MetricProps) {
  return (
    <div className="text-foreground-muted flex w-fit flex-col gap-2">
      <Popover>
        <PopoverTrigger className="text-start">
          <span className="border-border-strong w-fit border-b border-dashed">{title}</span>
        </PopoverTrigger>
        <PopoverContent>{popoverText}</PopoverContent>
      </Popover>
      <div className="flex flex-col">
        <span className="text-foreground-base text-xl font-medium">{primaryValue}</span>
        {secondaryValue && <span className="text-sm">{secondaryValue}</span>}
      </div>
    </div>
  );
}
