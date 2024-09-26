"use client";
import { CollateralEdgeType } from "@/components/VaultGraph/CollateralEdge";
import { VaultNodeType } from "@/components/VaultGraph/VaultNode";
import { Edge, Node, useOnSelectionChange } from "@xyflow/react";
import { useCallback, useState } from "react";

interface useGraphSelectedReturnType {
  selected: { type: "node"; node: VaultNodeType } | { type: "edge"; edge: CollateralEdgeType } | undefined;
}

export function useGraphSelected(): useGraphSelectedReturnType {
  const [selected, setSelected] = useState<
    { type: "node"; node: VaultNodeType } | { type: "edge"; edge: CollateralEdgeType } | undefined
  >(undefined);

  // the passed handler has to be memoized, otherwise the hook will not work correctly
  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      if (nodes.length > 0) {
        setSelected({ type: "node", node: nodes[0] as VaultNodeType });
      } else if (edges.length > 0) {
        setSelected({ type: "edge", edge: edges[0] as CollateralEdgeType });
      } else {
        setSelected(undefined);
      }
    },
    [setSelected]
  );

  useOnSelectionChange({
    onChange,
  });

  return { selected };
}
