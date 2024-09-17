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

// Breath first search of the vault graph via collateral
export function constructCollateralExposureGraph(
  root: Vault,
  graph: VaultGraphDataStructure,
  heightLimit?: number
): { nodes: VaultNodeType[]; allEdges: CollateralEdgeType[]; spanningTreeEdges: CollateralEdgeType[] } {
  const queue: Queue<{ vault: Vault; layer: number }> = new Queue();
  queue.enqueue({ vault: root, layer: 0 });

  const nodes: VaultNodeType[] = [];
  const allEdges: CollateralEdgeType[] = [];
  const spanningTreeEdges: CollateralEdgeType[] = [];

  const visited: Record<string, boolean> = {};

  // Setup first node
  visited[getGraphKey(root.chainId, root.address)] = true;
  nodes.push({
    id: getGraphKeyForVault(root),
    type: "vault",
    position: { x: 0, y: 0 },
    data: { vault: root, depth: 0 },
  });

  while (!queue.isEmpty()) {
    const { vault, layer } = queue.dequeue()!; // Won't be empty, just checked

    if (layer == heightLimit) {
      // Stop at the height limit
      break;
    }

    for (const collateral of vault.collateral) {
      const key = getGraphKey(collateral.chainId, collateral.collateralVaultAddress);
      const nextVault = getVaultInGraph(graph, collateral.chainId, collateral.collateralVaultAddress);
      if (!nextVault) {
        // Should never occur
        console.error(`Vault not found for collateral: ${collateral.collateralVaultAddress}`);
        continue;
      }

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
              x: 0,
              y: 0,
              // x: (Math.random() - 0.5) * 5000,
              // y: 400 * (layer + 1),
              // y: nextVault.type == "escrowedCollateral" ? 1000 : 400 * (layer + 1),
            }, // layout position elsewhere
            data: { vault: nextVault, depth: layer + 1 },
          });
        }
      }

      const edge: CollateralEdgeType = {
        id: `e${key}-${getGraphKeyForVault(vault)}`,
        type: "collateral",
        source: key,
        target: getGraphKeyForVault(vault),
        data: { collateral, vault, collateralVault: nextVault },
      };

      allEdges.push(edge);

      if (!alreadyVisited || nextVault?.type == "escrowedCollateral") {
        spanningTreeEdges.push({
          id: `e${key}-${getGraphKeyForVault(vault)}`,
          type: "collateral",
          source: key,
          target: getGraphKeyForVault(vault),
          data: { collateral, vault, collateralVault: nextVault },
        });
      }
    }
  }

  return { nodes, allEdges, spanningTreeEdges };
}

export function constructRehypothecationGraph(
  root: Vault,
  graph: VaultGraphDataStructure
): { nodes: VaultNodeType[]; allEdges: CollateralEdgeType[]; spanningTreeEdges: CollateralEdgeType[] } {
  const rootKey = getGraphKeyForVault(root);

  const nodes: VaultNodeType[] = [];
  const edges: CollateralEdgeType[] = [];

  nodes.push({
    id: rootKey,
    type: "vault",
    position: {
      x: 0,
      y: 0,
    }, // layout position elsewhere
    data: { vault: root, depth: 1 },
  });

  for (const vault of Object.values(graph)) {
    if (vault) {
      for (const collateral of vault?.collateral) {
        if (getGraphKey(collateral.chainId, collateral.collateralVaultAddress) == rootKey) {
          const vaultKey = getGraphKeyForVault(vault);
          nodes.push({
            id: vaultKey,
            type: "vault",
            position: {
              x: 0,
              y: 0,
            }, // layout position elsewhere
            data: { vault, depth: 0 },
          });

          edges.push({
            id: `e${vaultKey}-${rootKey}`,
            type: "collateral",
            source: rootKey,
            target: vaultKey,
            data: { collateral, vault, collateralVault: root },
          });
        }
      }
    }
  }

  return { nodes, allEdges: edges, spanningTreeEdges: [...edges] };
}
