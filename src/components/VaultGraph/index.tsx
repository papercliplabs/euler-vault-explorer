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
    <div className="relative h-[700px] max-h-[calc(100svh-90px)] w-full overflow-hidden rounded-[24px] border">
      <div className="absolute hidden h-full w-full opacity-10 md:block">
        <div className="absolute left-1/4 top-0 h-1/3 w-1/3 rounded-full bg-[#FFE072] blur-[120px]"></div>
        <div className="absolute left-1/4 top-1/2 h-1/4 w-1/4 rounded-full bg-[#FF4400] blur-[150px]"></div>
        <div className="absolute bottom-1/2 left-1/4 h-1/4 w-1/2 rounded-full bg-[#8B78FF] blur-[130px]"></div>
        <div className="absolute bottom-1/3 left-1/2 h-1/3 w-1/3 rounded-full bg-[#38FF70] blur-[200px]"></div>
        <div className="absolute right-[12.5%] top-1/4 h-1/2 w-1/4 rounded-full bg-[#5AE9FD] blur-[150px]"></div>
      </div>
      <ReactFlowProvider>
        <VaultGraphGraph root={vault} graph={graph} />
      </ReactFlowProvider>
    </div>
  );
}
