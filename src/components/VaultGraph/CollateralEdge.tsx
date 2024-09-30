"use client";
import { ReactNode, useMemo, useState } from "react";
import { Edge, EdgeProps, BaseEdge, EdgeLabelRenderer, useViewport, useNodes } from "@xyflow/react";
import { Collateral, OracleType, Vault } from "@/utils/types";
import { ArrowRight, OracleTypeIcon } from "../Icons";
import clsx from "clsx";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { palette } from "@/theme/tailwind.config";

import "react-circular-progressbar/dist/styles.css";
import { formatNumber, formatVaultName } from "@/utils/format";
import { getCustomBezierPath } from "@/utils/getCustomBezierCurve";
import TooltipPopover from "../ui/tooltipPopover";
import { ORACLE_TYPE_INFO_MAPPING } from "@/utils/constants";
import ExternalLink from "../ExternalLink";
import { VaultNodeType } from "./VaultNode";
import { useGraphSelected } from "@/hooks/useGraphSelected";
import { isAddressEqual, zeroAddress } from "viem";

export type CollateralEdgeType = Edge<
  {
    collateral: Collateral;
    vault: Vault;
    collateralVault: Vault;
  },
  "collateral"
>;

export default function CollateralEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  selected,
}: EdgeProps<CollateralEdgeType>) {
  const nodes = useNodes<VaultNodeType>();
  const [hovered, setHovered] = useState<boolean>(false);
  const { selected: selectedGraphItem } = useGraphSelected();

  const [collateral, vault, collateralVault] = useMemo(() => {
    return [data?.collateral, data?.vault, data?.collateralVault];
  }, [data]);

  const visibilityState: "selected" | "fade" | "normal" = useMemo(() => {
    if (selected) {
      return "selected";
    } else if (!selectedGraphItem) {
      return "normal";
    } else {
      let connectedToSelected = false;

      // Check if the edge is connected to the selected node
      if (selectedGraphItem.type == "node") {
        if (
          isAddressEqual(selectedGraphItem.node.data.vault.address, vault?.address ?? zeroAddress) ||
          isAddressEqual(selectedGraphItem.node.data.vault.address, collateralVault?.address ?? zeroAddress)
        ) {
          connectedToSelected = true;
        }
      }

      return connectedToSelected ? "selected" : "fade";
    }
  }, [selected, selectedGraphItem, vault?.address, collateralVault?.address]);

  if (!collateral || !vault || !collateralVault) {
    return null;
  }

  const [edgePath, labelX, labelY] = getCustomBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.35,
    nodes,
  });

  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="nodrag nopan">
      <BaseEdge
        id={id}
        path={edgePath}
        className={clsx(
          visibilityState == "selected"
            ? "!stroke-semantic-accent"
            : hovered
              ? "stroke-semantic-accent/50"
              : "stroke-foreground-muted",
          visibilityState == "fade" ? "opacity-30" : "opacity-100"
        )}
        style={{
          strokeWidth: "2px",
          strokeLinecap: "round",
          strokeDasharray: "3 5",
          strokeDashoffset: 2,
          animation: "dashdraw 0.6s linear infinite",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className={clsx(
            "nopan nodrag absolute flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full",
            visibilityState == "fade" ? "opacity-30" : "opacity-100"
          )}
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
              "bg-euler-600 absolute flex h-6 w-6 rounded-full border",
              selected
                ? "border-semantic-accent"
                : hovered
                  ? "border-semantic-accent/50"
                  : "border-border-strong hover:border-semantic-accent/50"
            )}
          >
            <OracleTypeIcon type={collateral.oracle?.type ?? "CrossAdapter"} className="h-full w-full" />
          </div>
        </div>
      </EdgeLabelRenderer>
      {(selected || (selectedGraphItem && hovered && visibilityState != "fade")) && (
        <CustomEdgeToolbar labelX={labelX} labelY={labelY}>
          <CollateralPopover collateral={collateral} vault={vault} collateralVault={collateralVault} />
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
        className={clsx("nopan nodrag absolute z-[1]")}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

function CollateralPopover({
  collateral,
  vault,
  collateralVault,
}: {
  collateral: Collateral;
  vault: Vault;
  collateralVault: Vault;
}) {
  const items: { title: string; value: string | ReactNode; description: string }[] = [
    {
      title: "Oracle",
      value: (
        <>
          {collateral.oracle ? (
            <ExternalLink
              href={`https://oracles.euler.finance/adapter/${collateral.oracle.oracleAddress}`}
              className="flex min-w-0 pl-1"
            >
              <OracleTypeIcon type={collateral.oracle.type} className="h-[20px] w-[20px] shrink-0" />
              <span className="text-semantic-accent truncate">
                {ORACLE_TYPE_INFO_MAPPING[collateral.oracle.type as OracleType]?.name ?? collateral.oracle.type}
              </span>
            </ExternalLink>
          ) : (
            "unknown"
          )}
        </>
      ),
      description: "The oracle used by the parent vault to price the collateral vault in its unit of account.",
    },
    {
      title: "Borrowing LTV",
      value: formatNumber({ input: collateral.borrowLoanToValue ?? 0, unit: "%" }),
      description:
        "The maximum percentage of a loan that can be borrowed relative to the value of the collateral when initiating a new loan.",
    },
    {
      title: "Liquidation LTV",
      value: formatNumber({ input: collateral.liquidationLoanToValue ?? 0, unit: "%" }),
      description:
        "The threshold percentage at which the value of an existing loan relative to the collateral can trigger liquidation.",
    },
  ];

  return (
    <div className="bg-euler-700/20 body-sm w-[224px] rounded-[8px] border shadow-lg backdrop-blur-md">
      <div className="border-border-strong relative flex justify-between gap-10 border-b p-3 pb-2">
        <div className="absolute left-1/2 top-1/2 flex h-[25px] w-[25px] shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10">
          <ArrowRight className="h-[10px] w-[10px] p-0" />
        </div>

        <div className="flex min-w-0 flex-1 shrink-0 grow flex-col overflow-hidden text-center">
          <span className="body-xs text-foreground-subtle">Collateral</span>
          <span className="body-sm truncate font-medium">{formatVaultName({ vault: collateralVault })}</span>
        </div>

        <div className="flex min-w-0 flex-1 shrink-0 grow flex-col overflow-hidden text-center">
          <span className="body-xs text-foreground-subtle">For</span>
          <span className="body-sm truncate font-medium">{formatVaultName({ vault })}</span>
        </div>
      </div>
      <div className="px-3 py-2">
        {items.map((item, i) => (
          <div className="flex min-w-0 justify-between overflow-hidden py-1" key={i}>
            <TooltipPopover trigger={item.title}>{item.description}</TooltipPopover>
            <div className="text-foreground-subtle flex min-w-0 overflow-hidden">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
