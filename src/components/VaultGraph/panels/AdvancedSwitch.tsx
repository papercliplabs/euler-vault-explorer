import { Switch } from "@/components/ui/switch";
import TooltipPopover from "@/components/ui/tooltipPopover";
import { Panel } from "@xyflow/react";

interface AdvancedSwitchProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export default function AdvancedSwitch({ checked, setChecked }: AdvancedSwitchProps) {
  return (
    <Panel
      position="bottom-left"
      className="bg-background-base flex h-[48px] items-center gap-3 rounded-full border px-4 py-2.5"
    >
      <Switch checked={checked} onCheckedChange={setChecked} />
      <TooltipPopover
        trigger={
          <span className="body-sm border-foreground-base border-b border-dashed font-medium">Advanced view</span>
        }
      >
        Advanced view shows the entire depth, and all cycles in the graph.
      </TooltipPopover>
    </Panel>
  );
}
