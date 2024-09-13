"use client";
import { useCallback, useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  Node,
  Edge,
  EdgeProps,
  getStraightPath,
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  NodeToolbar,
} from "@xyflow/react";
import { Collateral, Vault } from "@/utils/types";
import { TokenIcon, VaultTypeIcon } from "../Icons";
import { VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
import clsx from "clsx";

export type CollateralEdgeType = Edge<
  {
    collateral: Collateral;
  },
  "collateral"
>;

export default function CollateralEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps<CollateralEdgeType>) {
  const [hovered, setHovered] = useState<boolean>(false);

  const collateral = data?.collateral;

  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="nodrag nopan">
      <BaseEdge
        id={id}
        path={edgePath}
        className={clsx(selected ? "!stroke-semantic-accent" : hovered ? "stroke-semantic-accent/50" : "stroke-white")}
      />
      <EdgeLabelRenderer>
        <button
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nopan nodrag absolute"
          onClick={() => console.log("ORACLE CLICK")}
        >
          HERE
        </button>
      </EdgeLabelRenderer>
      <NodeToolbar isVisible={true}>TESTIN</NodeToolbar>
    </g>
  );
}
