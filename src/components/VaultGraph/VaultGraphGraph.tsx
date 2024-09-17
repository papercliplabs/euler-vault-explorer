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
  useReactFlow,
  Panel,
} from "@xyflow/react";
import VaultNode, { VaultNodeType } from "./VaultNode";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import ViewportControls from "./panels/ViewportControls";
import GraphTypeSelector, { GraphType } from "./panels/GraphTypeSelector";
import AdvancedSwitch from "./panels/AdvancedSwitch";
import CollateralEdge, { CollateralEdgeType } from "./CollateralEdge";
import { constructGraph, getVaultInGraph, getVaultInGraphForCollateral, VaultGraphDataStructure } from "@/utils/graph";
import Dagre from "@dagrejs/dagre";

interface VaultGraphGraphProps {
  root: Vault;
  graph: VaultGraphDataStructure;
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = { vault: VaultNode };
const edgeTypes: EdgeTypes = { collateral: CollateralEdge };

const getDagreLayoutedElements = (nodes: any, edges: any, options: any) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction, nodesep: 350, ranksep: 300 });

  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: any) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export default function VaultGraphGraph({ root, graph }: VaultGraphGraphProps) {
  const [graphType, setGraphType] = useState<GraphType>("collateralExposure");
  const [advancedSwitchChecked, setAdvancedSwitchChecked] = useState<boolean>(false);

  const { fitView } = useReactFlow();

  const {
    nodes: rawNodes,
    allEdges,
    spanningTreeEdges,
  } = useMemo(
    () => constructGraph(root, graph, advancedSwitchChecked ? undefined : 4),
    [root, graph, advancedSwitchChecked]
  );

  // Only use spanning tree edges for layout
  const [layoutedNodes, layoutedEdges] = useMemo(() => {
    const { nodes, edges } = getDagreLayoutedElements(rawNodes, spanningTreeEdges, { direction: "BT" });
    return [nodes, edges];
  }, [rawNodes, spanningTreeEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
  }, [setNodes, layoutedNodes]);

  useEffect(() => {
    setEdges(advancedSwitchChecked ? allEdges : spanningTreeEdges);
  }, [setEdges, advancedSwitchChecked, allEdges, spanningTreeEdges]);

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
