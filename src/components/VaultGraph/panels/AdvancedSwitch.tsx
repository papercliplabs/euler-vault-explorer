import { Switch } from "@/components/ui/switch";
import { Panel } from "@xyflow/react";

interface AdvancedSwitchProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export default function AdvancedSwitch({ checked, setChecked }: AdvancedSwitchProps) {
  return (
    <Panel
      position="bottom-left"
      className="bg-background-base flex items-center gap-3 rounded-full border px-4 py-2.5"
    >
      <Switch checked={checked} onCheckedChange={setChecked} />
      <span className="body-sm font-medium">Advanced view</span>
    </Panel>
  );
}
