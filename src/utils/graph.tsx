import { VaultNodeType } from "@/components/VaultGraph/VaultNode";
import { Collateral, SupportedChainId, Vault } from "@/utils/types";
import { Address } from "viem";
import Queue from "queue-fifo";
import { CollateralEdgeType } from "@/components/VaultGraph/CollateralEdge";

export type VaultGraphDataStructure = Record<string, Vault | undefined>;

export function getGraphKey(chainId: SupportedChainId, vaultAddress: Address): string {
  return chainId + vaultAddress;
}

function getGraphKeyForVault(vault: Vault): string {
  return getGraphKey(vault.chainId, vault.address);
}

export function getVaultInGraph(
  graph: VaultGraphDataStructure,
  chainId: SupportedChainId,
  vaultAddress: Address
): Vault | undefined {
  return graph[getGraphKey(chainId, vaultAddress)];
}

export function getVaultInGraphForCollateral(
  graph: VaultGraphDataStructure,
  collateral: Collateral
): Vault | undefined {
  return graph[getGraphKey(collateral.chainId, collateral.collateralVaultAddress)];
}

export function constructGraph(root: Vault, graph: VaultGraphDataStructure, simplified: boolean) {
  const queue: Queue<{ vault: Vault; layer: number }> = new Queue();
  queue.enqueue({ vault: root, layer: 0 });

  const nodes: VaultNodeType[] = [];
  const edges: CollateralEdgeType[] = [];

  const visited: Record<string, boolean> = {};

  // Setup first node
  visited[getGraphKey(root.chainId, root.address)] = true;
  nodes.push({ id: getGraphKeyForVault(root), type: "vault", position: { x: 0, y: 0 }, data: { vault: root } });

  while (!queue.isEmpty()) {
    const { vault, layer } = queue.dequeue()!; // Won't be empty, just checked

    for (const collateral of vault.collateral) {
      const key = getGraphKey(collateral.chainId, collateral.collateralVaultAddress);
      const nextVault = getVaultInGraph(graph, collateral.chainId, collateral.collateralVaultAddress);
      const alreadyVisited = visited[key];

      // Add vault to queue, and mark visited
      if (!alreadyVisited) {
        visited[key] = true;

        // TODO: handle undefined here (just don't queue, but add a node still)
        if (nextVault) {
          // Add to queue so we will visits its collateral
          queue.enqueue({ vault: nextVault!, layer: layer + 1 });

          // Add node
          nodes.push({
            id: key,
            type: "vault",
            position: {
              x: (Math.random() - 0.5) * 5000,
              y: 400 * (layer + 1),
              // y: nextVault.type == "escrowedCollateral" ? 1000 : 400 * (layer + 1),
            }, // TODO: actual position
            data: { vault: nextVault },
          });
        }
      }

      if (!simplified || !alreadyVisited || nextVault?.type == "escrowedCollateral") {
        edges.push({
          id: `e${key}-${getGraphKeyForVault(vault)}`,
          type: "collateral",
          source: key,
          target: getGraphKeyForVault(vault),
          data: { collateral },
        });
      }
    }
  }

  return { nodes, edges };
}
