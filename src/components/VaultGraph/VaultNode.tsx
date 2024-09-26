"use client";
import { ReactNode, useMemo } from "react";
import { Handle, Position, NodeProps, Node, NodeToolbar, useNodes, useEdges } from "@xyflow/react";
import { Vault } from "@/utils/types";
import { VaultTypeIcon } from "../Icons";
import { VAULT_TYPE_INFO_MAPPING } from "@/utils/constants";
import clsx from "clsx";
import { formatAddress, formatNumber, formatVaultName } from "@/utils/format";
import { Button } from "../ui/button";
import Link from "next/link";
import ArrowUpRight from "../Icons/core/ArrowUpRight";
import { etherscanLink } from "@/utils/etherscan";
import { VaultIcon } from "../Icons/special/VaultIcon";
import ExternalLink from "../ExternalLink";
import TooltipPopover from "../ui/tooltipPopover";
import VaultTypeDescriptor from "../VaultTypeDescriptor";
import { useGraphSelected } from "@/hooks/useGraphSelected";
import { CollateralEdgeType } from "./CollateralEdge";
import SupplyApyTooltipPopover from "../SupplyApyTooltipPopover";

export type VaultNodeType = Node<
  {
    isRoot: boolean;
    vault: Vault;
  },
  "vault"
>;

export default function VaultNode({ id, data: { vault, isRoot }, selected }: NodeProps<VaultNodeType>) {
  const { selected: selectedGraphItem } = useGraphSelected();

  const edges = useEdges<CollateralEdgeType>();

  const visibilityState: "selected" | "fade" | "normal" = useMemo(() => {
    if (selected) {
      return "selected";
    } else if (!selectedGraphItem) {
      return "normal";
    } else {
      let connectedToSelected = false;

      // Check if the node is connected to the selected node
      if (selectedGraphItem.type == "node") {
        for (const edge of edges) {
          if (edge.source == id && edge.target == selectedGraphItem.node.id) {
            connectedToSelected = true;
          }
          if (edge.target == id && edge.source == selectedGraphItem.node.id) {
            connectedToSelected = true;
          }
        }
      }

      // Check if the node is connected to the selected edge
      if (selectedGraphItem.type == "edge") {
        if (selectedGraphItem.edge.source == id || selectedGraphItem.edge.target == id) {
          connectedToSelected = true;
        }
      }

      return connectedToSelected ? "normal" : "fade";
    }
  }, [id, selected, selectedGraphItem, edges]);

  return (
    <div
      className={clsx(
        "bg-euler-700/20 border-border-strong flex h-[48px] cursor-pointer items-center gap-2 rounded-full border p-1 pr-4 shadow-md backdrop-blur-sm transition-all",
        visibilityState == "selected" ? "border-semantic-accent" : "hover:border-semantic-accent/50",
        visibilityState == "fade" ? "opacity-30" : "opacity-100"
      )}
    >
      <Handle type="source" position={Position.Top} className="border-none bg-transparent" />
      <Handle type="target" position={Position.Bottom} className="border-none bg-transparent" />

      <VaultIcon vault={vault} size={40} badgeType="entity" />

      <div className="flex min-w-0 max-w-[120px] flex-col overflow-hidden">
        <div className="truncate font-medium">{formatVaultName({ vault })}</div>
        <div className="body-cs text-foreground-muted flex items-center gap-1">
          <VaultTypeIcon type={vault.type} className="fill-foreground-muted h-5 w-5 shrink-0" />
          <span>{VAULT_TYPE_INFO_MAPPING[vault.type].shortName}</span>
        </div>
      </div>

      <NodeToolbar position={Position.Right} className="nodrag nopan">
        <VaultNodePopover vault={vault} isRoot={isRoot} />
      </NodeToolbar>
    </div>
  );
}

function VaultNodePopover({ vault, isRoot }: { vault: Vault; isRoot: boolean }) {
  const items: { title: string; value: string | ReactNode; popoverContent: ReactNode }[] = [
    {
      title: "Vault Type",
      value: (
        <div className="flex items-center gap-1.5">
          <VaultTypeIcon type={vault.type} className="fill-foreground-subtle h-[20px] w-[20px]" />
          <span className="text-nowrap">{VAULT_TYPE_INFO_MAPPING[vault.type].shortName}</span>
        </div>
      ),
      popoverContent: <VaultTypeDescriptor />,
    },
    {
      title: "Total Supplied",
      value:
        vault.totalSuppliedUsd != undefined
          ? formatNumber({ input: vault.totalSuppliedUsd, unit: "USD", compact: true })
          : "-",
      popoverContent: "The total amount and value of the underlying assets currently supplied into this vault.",
    },
    {
      title: "Supply APY",
      value:
        vault.supplyRewards.length > 0 ? (
          <SupplyApyTooltipPopover supplyApy={vault.supplyApy} rewards={vault.supplyRewards} />
        ) : (
          formatNumber({ input: vault.supplyApy, unit: "%" })
        ),
      popoverContent: "The annual percent yield (APY) earned for supplying into this vault.",
    },
    ...(vault.type != "escrowedCollateral"
      ? [
          {
            title: "Total Borrowed",
            value:
              vault.totalBorrowedUsd != undefined
                ? formatNumber({ input: vault.totalBorrowedUsd, unit: "USD", compact: true })
                : "-",
            popoverContent: "The total amount and value of the underlying assets currently borrowed from this vault.",
          },
          {
            title: "Borrow APY",
            value: formatNumber({ input: vault.borrowApy, unit: "%" }),
            popoverContent: "The annual percent yield (APY) paid for borrowing from this vault.",
          },
        ]
      : []),
  ];

  return (
    <div className="bg-euler-700/20 body-sm w-[224px] overflow-visible rounded-[8px] border py-2 shadow-lg backdrop-blur-md">
      <div className="flex gap-3 border-b px-3 pb-2">
        <VaultIcon vault={vault} size={40} badgeType="entity" />
        <div className="flex min-w-0 flex-col justify-center">
          <span className="truncate">{formatVaultName({ vault })}</span>
          <ExternalLink href={etherscanLink(vault.chainId, vault.address)} className="body-xs text-semantic-accent">
            {formatAddress({ address: vault.address })}
          </ExternalLink>
        </div>
      </div>
      <div className="px-3 pt-1">
        {items.map((item, i) => (
          <div className="flex justify-between py-1" key={i}>
            <TooltipPopover trigger={item.title}>{item.popoverContent}</TooltipPopover>
            <div className="text-foreground-subtle">{item.value}</div>
          </div>
        ))}
        {!isRoot && (
          <Button asChild className="mt-2">
            <Link href={`/${vault.chainId}/${vault.address}`} className="w-full">
              View vault
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
