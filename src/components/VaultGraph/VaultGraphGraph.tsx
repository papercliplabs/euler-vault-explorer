"use client";
import { Vault } from "@/utils/types";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  DefaultEdgeOptions,
  NodeTypes,
  EdgeTypes,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import VaultNode, { VaultNodeType } from "./VaultNode";
import { useState } from "react";
import ViewportControls from "./panels/ViewportControls";
import GraphTypeSelector, { GraphType } from "./panels/GraphTypeSelector";
import AdvancedSwitch from "./panels/AdvancedSwitch";
import CollateralEdge, { CollateralEdgeType } from "./CollateralEdge";

interface VaultGraphGraphProps {
  vault: Vault;
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = { vault: VaultNode };
const edgeTypes: EdgeTypes = { collateral: CollateralEdge };

export default function VaultGraphGraph({ vault }: VaultGraphGraphProps) {
  const [graphType, setGraphType] = useState<GraphType>("collateralExposure");
  const [advancedSwitchChecked, setAdvancedSwitchChecked] = useState<boolean>(false);

  const initialNodes: VaultNodeType[] = [
    { id: "1", type: "vault", position: { x: 0, y: 0 }, data: { vault } },
    { id: "2", type: "vault", position: { x: 0, y: 100 }, data: { vault } },
    { id: "3", type: "vault", position: { x: 400, y: 100 }, data: { vault } },
  ];

  const initialEdges: CollateralEdgeType[] = [
    { id: "e1-2", type: "collateral", source: "2", target: "1", data: { collateral: vault.collateral[0] } },
    { id: "e1-3", type: "collateral", source: "3", target: "1", data: { collateral: vault.collateral[0] } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState(initialEdges);

  return (
    <div className="bg-background-subtle h-[800px] w-full overflow-hidden rounded-[24px] border">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={10} color="rgb(67 89 113 / 0.4)" variant={BackgroundVariant.Dots} size={2} />

        <GraphTypeSelector graphType={graphType} setGraphType={setGraphType} />
        <AdvancedSwitch checked={advancedSwitchChecked} setChecked={setAdvancedSwitchChecked} />
        <ViewportControls />
      </ReactFlow>
    </div>
  );
}
