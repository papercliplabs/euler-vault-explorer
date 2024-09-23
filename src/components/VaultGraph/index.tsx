import { ReactFlowProvider } from "@xyflow/react";
import VaultGraphGraph from "./VaultGraphGraph";
import { Vault } from "@/utils/types";
import { getGraphKey, VaultGraphDataStructure } from "../../utils/graph";

interface VaultGraphProps {
  vault: Vault;
  allVaults: Vault[];
}

export default function VaultGraph({ vault, allVaults }: VaultGraphProps) {
  const graph: VaultGraphDataStructure = {};
  allVaults.forEach((vault) => {
    graph[getGraphKey(vault.chainId, vault.address)] = vault;
  });

  return (
    <div className="bg-background-subtle h-[700px] max-h-[calc(100svh-90px)] w-full overflow-visible rounded-[24px] border">
      <ReactFlowProvider>
        <VaultGraphGraph root={vault} graph={graph} />
      </ReactFlowProvider>
    </div>
  );
}
