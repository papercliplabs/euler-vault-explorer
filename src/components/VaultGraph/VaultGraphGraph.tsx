"use client";
import { Vault } from "@/utils/types";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  useEdgesState,
  useReactFlow,
  applyNodeChanges,
} from "@xyflow/react";
import VaultNode, { VaultNodeType } from "./VaultNode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewportControls from "./panels/ViewportControls";
import GraphTypeSelector, { GraphType } from "./panels/GraphTypeSelector";
import AdvancedSwitch from "./panels/AdvancedSwitch";
import CollateralEdge from "./CollateralEdge";
import {
  constructCollateralExposureGraph,
  constructRehypothecationGraph,
  VaultGraphDataStructure,
} from "@/utils/graph";
import Dagre from "@dagrejs/dagre";

const DISABLE_EDGE_ANIMATION_THRESHOLD = 50;

interface VaultGraphGraphProps {
  root: Vault;
  graph: VaultGraphDataStructure;
}

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
  const [graphType, setGraphType] = useState<GraphType>(
    root.type == "escrowedCollateral" ? "rehypothecation" : "collateralExposure"
  );
  const [advancedSwitchChecked, setAdvancedSwitchChecked] = useState<boolean>(false);
  const [shouldFitView, setShouldFitView] = useState<boolean>(false);
  const { fitView } = useReactFlow();
  const firstRenderRef = useRef(true);

  const {
    nodes: rawNodes,
    allEdges,
    spanningTreeEdges,
  } = useMemo(() => {
    return graphType == "collateralExposure"
      ? constructCollateralExposureGraph(root, graph, advancedSwitchChecked ? undefined : 3)
      : constructRehypothecationGraph(root, graph);
  }, [root, graph, advancedSwitchChecked, graphType]);

  // Only use spanning tree edges for layout
  const layoutedNodes = useMemo(() => {
    const { nodes } = getDagreLayoutedElements(rawNodes, spanningTreeEdges, {
      direction: "BT",
    });
    return nodes;
  }, [rawNodes, spanningTreeEdges]);

  const [nodes, setNodes] = useState<VaultNodeType[]>(layoutedNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState(spanningTreeEdges);
  const onNodesChange = useCallback(
    (changes: any) => {
      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));

      // Fit view after nodes change if requested
      if (shouldFitView) {
        fitView({ padding: 0.3, minZoom: 0.5 });
        setShouldFitView(false);
      }
    },
    [setNodes, shouldFitView, setShouldFitView, fitView]
  );

  useEffect(() => {
    setNodes(layoutedNodes);

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      setShouldFitView(true);
    }
  }, [setNodes, layoutedNodes, setShouldFitView]);

  useEffect(() => {
    setEdges(advancedSwitchChecked ? allEdges : spanningTreeEdges);
  }, [setEdges, advancedSwitchChecked, allEdges, spanningTreeEdges]);

  const disableEdgeAnimation = useMemo(() => {
    return edges.length > DISABLE_EDGE_ANIMATION_THRESHOLD;
  }, [edges.length]);

  return (
    <div className="bg-background-subtle h-full w-full overflow-visible rounded-[24px] border">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ animated: !disableEdgeAnimation }}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.5 }}
        maxZoom={2}
        minZoom={0.25}
        multiSelectionKeyCode={null}
        selectionKeyCode={null}
        // Hack to prevent initial glitch from react flow bug with node origin on fit view first layout
        // nodeOrigin={[0.5, 0.5]}
        // onInit={({ fitView }) => fitView({ padding: 0.25 })}
        // defaultViewport={{ zoom: 100, x: -10000, y: -10000 }}
      >
        <Background gap={20} color="rgb(67 89 113 / 0.4)" variant={BackgroundVariant.Dots} size={2} />

        <GraphTypeSelector
          graphType={graphType}
          setGraphType={setGraphType}
          disableCollateralExpose={root.type == "escrowedCollateral"}
        />
        <AdvancedSwitch
          checked={advancedSwitchChecked}
          setChecked={setAdvancedSwitchChecked}
          visible={graphType == "collateralExposure"}
        />
        <ViewportControls />
      </ReactFlow>
    </div>
  );
}
