import { Switch } from "@/components/ui/switch";
import TooltipPopover from "@/components/ui/tooltipPopover";
import { Panel } from "@xyflow/react";
import clsx from "clsx";

interface AdvancedSwitchProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  visible: boolean;
}

export default function AdvancedSwitch({ checked, setChecked, visible }: AdvancedSwitchProps) {
  return (
    <Panel
      position="bottom-left"
      className={clsx(
        "bg-background-base m-4 flex h-[48px] items-center gap-3 rounded-full border px-4 py-2.5",
        visible ? "visible" : "hidden"
      )}
    >
      <Switch checked={checked} onCheckedChange={setChecked} />
      <TooltipPopover trigger="Advanced view">
        Advanced view shows the entire depth, and all cycles in the graph.
      </TooltipPopover>
    </Panel>
  );
}
