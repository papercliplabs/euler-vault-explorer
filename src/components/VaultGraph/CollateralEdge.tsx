"use client";
import { ReactNode, useState } from "react";
import { Edge, EdgeProps, BaseEdge, EdgeLabelRenderer, getSimpleBezierPath, useViewport } from "@xyflow/react";
import { Collateral } from "@/utils/types";
import { ArrowRight, OracleTypeIcon } from "../Icons";
import clsx from "clsx";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { palette } from "@/theme/tailwind.config";

import "react-circular-progressbar/dist/styles.css";
import { formatNumber } from "@/utils/format";
import { PopoverContent, Popover, PopoverTrigger } from "../ui/popover";
import Link from "next/link";

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
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nopan nodrag absolute flex h-[42px] w-[42px] items-center justify-center rounded-full"
        >
          <div className="absolute left-0 right-0 top-0">
            <CircularProgressbar
              value={(collateral?.liquidationLoanToValue ?? 0) * 100}
              strokeWidth={8}
              styles={buildStyles({ pathColor: palette.teal[700], trailColor: "#1e444d" })}
            />
          </div>
          <div
            className={clsx(
              "bg-euler-600 absolute flex h-8 w-8 rounded-full border",
              selected
                ? "border-semantic-accent"
                : hovered
                  ? "border-semantic-accent/50"
                  : "border-border-strong hover:border-semantic-accent/50"
            )}
          >
            <OracleTypeIcon type={collateral?.oracle?.type ?? "CrossAdapter"} />
          </div>
        </div>
      </EdgeLabelRenderer>
      {selected && (
        <CustomEdgeToolbar labelX={labelX} labelY={labelY}>
          <CollateralPopover collateral={collateral} />
        </CustomEdgeToolbar>
      )}
    </g>
  );
}

function CustomEdgeToolbar({ labelX, labelY, children }: { labelX: number; labelY: number; children: ReactNode }) {
  const { zoom } = useViewport();

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          transformOrigin: "center left",
          transform: `translate(31px, -50%) translate(${labelX}px, ${labelY}px) scale(${1 / zoom}) `,
          pointerEvents: "all",
        }}
        className={clsx("nopan nodrag absolute z-10")}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

function CollateralPopover({ collateral }: { collateral?: Collateral }) {
  const items: { title: string; value: string | ReactNode; description: string }[] = [
    {
      title: "Oracle",
      value: (
        <Link href="/TODO" className="flex items-center">
          <OracleTypeIcon type={collateral?.oracle?.type ?? "CrossAdapter"} className="h-[20px] w-[20px]" />
          <span className="text-semantic-accent">{collateral?.oracle?.type}</span>
          {/* <ArrowUpRight /> */}
        </Link>
      ),
      description: "TODO",
    },
    {
      title: "Borrowing Loan to Value",
      value: formatNumber({ input: collateral?.borrowLoanToValue ?? 0, unit: "%" }),
      description: "TODO",
    },
    {
      title: "Liquidation Loan to Value",
      value: formatNumber({ input: collateral?.liquidationLoanToValue ?? 0, unit: "%" }),
      description: "TODO",
    },
  ];

  return (
    <div className="bg-euler-700/20 body-sm w-[224px] rounded-[8px] border shadow-lg backdrop-blur-md">
      <div className="border-border-strong flex items-center justify-between border-b p-3 pb-2">
        <div className="flex flex-1 grow flex-col items-center justify-center text-center">
          <span className="body-xs text-foreground-subtle">Collateral</span>
          <span className="body-sm font-medium">TODO</span>
        </div>

        <div className="flex w-[25px] shrink-0 items-center justify-center rounded-full bg-white/10">
          <ArrowRight className="h-[20px w-[20px]" />
        </div>
        <div className="flex flex-1 grow flex-col items-center justify-center text-center">
          <span className="body-xs text-foreground-subtle">For</span>
          <span className="body-sm font-medium">TODO</span>
        </div>
      </div>
      <div className="px-3 py-2">
        {items.map((item, i) => (
          <div className="flex justify-between py-1" key={i}>
            <Popover>
              <PopoverTrigger className="border-border-strong border-b border-dashed">{item.title}</PopoverTrigger>
              <PopoverContent>{item.description}</PopoverContent>
            </Popover>
            <div className="text-foreground-subtle">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
