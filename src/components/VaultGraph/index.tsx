import { ReactFlowProvider } from "@xyflow/react";
import VaultGraphGraph from "./VaultGraphGraph";
import { Vault } from "@/utils/types";

interface VaultGraphProps {
  vault: Vault;
}

export default function VaultGraph({ vault }: VaultGraphProps) {
  return (
    <div className="bg-background-subtle h-[800px] w-full overflow-hidden rounded-[24px] border">
      <ReactFlowProvider>
        <VaultGraphGraph vault={vault} />
      </ReactFlowProvider>
    </div>
  );
}
