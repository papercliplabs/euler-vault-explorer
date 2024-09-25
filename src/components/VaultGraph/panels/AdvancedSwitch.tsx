"use client";
import ControlledSwitch from "@/components/ui/controlledSwitch";
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
        "bg-background-base m-4 flex h-[48px] items-center rounded-full border py-2.5 pr-4",
        visible ? "visible" : "hidden"
      )}
    >
      <button className="h-[48px] pl-4 pr-3" onClick={() => setChecked(!checked)}>
        <ControlledSwitch checked={checked} />
      </button>
      <TooltipPopover trigger="Advanced view">
        Advanced view shows the entire depth, and all cycles in the graph.
      </TooltipPopover>
    </Panel>
  );
}
