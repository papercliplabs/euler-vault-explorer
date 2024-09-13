"use client";
import { ReactNode, useCallback } from "react";
import { Handle, Position, NodeProps, Node, NodeToolbar } from "@xyflow/react";
import { Vault } from "@/utils/types";
import { TokenIcon, VaultTypeIcon } from "../Icons";
import { VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import clsx from "clsx";
import { formatAddress, formatNumber } from "@/utils/format";
import { Button } from "../ui/button";
import Link from "next/link";
import ArrowUpRight from "../Icons/core/ArrowUpRight";
import { CHAIN_CONFIGS } from "@/config";

export type VaultNodeType = Node<
  {
    vault?: Vault;
  },
  "vault"
>;

export default function VaultNode({ data: { vault }, selected }: NodeProps<VaultNodeType>) {
  console.log(vault);
  return (
    <div
      className={clsx(
        // "nodrag",
        "bg-euler-700/20 border-border-strong flex gap-2 rounded-full border p-1 pr-4 shadow-md backdrop-blur-sm",
        selected ? "border-semantic-accent" : "hover:border-semantic-accent/50"
      )}
      onClick={() => console.log("CLICK")}
    >
      <Handle type="source" position={Position.Top} className="border-none bg-transparent" />
      <Handle type="target" position={Position.Bottom} className="border-none bg-transparent" />
      {vault ? (
        <>
          <TokenIcon
            symbol={vault.underlyingAssetSymbol}
            imgSrc={vault.underlyingAssetImgSrc}
            size={40}
            className="border-white/16 aspect-square shrink-0 border"
          />
          <div className="flex flex-col">
            <div>
              <span>{vault.symbol}</span>
            </div>
            <div className="body-cs text-foreground-muted flex items-center gap-1">
              <VaultTypeIcon type={vault.type} className="fill-foreground-muted" />
              <span>{VAULT_TYPE_NAME_MAPPING[vault.type]}</span>
            </div>
          </div>

          <NodeToolbar position={Position.Right} className="nodrag nopan">
            <VaultNodePopover vault={vault} />
          </NodeToolbar>
        </>
      ) : (
        "UNDEFINED"
      )}
    </div>
  );
}

function VaultNodePopover({ vault }: { vault: Vault }) {
  const items: { title: string; value: string | ReactNode; description: string }[] = [
    { title: "Supply APY", value: formatNumber({ input: vault.supplyApy, unit: "%" }), description: "TODO" },
    {
      title: "Total Supplied",
      value: vault.totalSuppliedUsd ? formatNumber({ input: vault.totalSuppliedUsd, unit: "USD" }) : "TODO",
      description: "TODO",
    },
    { title: "Borrow APY", value: formatNumber({ input: vault.borrowApy, unit: "%" }), description: "TODO" },
    {
      title: "Total Borrowed",
      value: vault.totalBorrowedUsd ? formatNumber({ input: vault.totalBorrowedUsd, unit: "USD" }) : "TODO",
      description: "TODO",
    },
    {
      title: "Vault Type",
      value: (
        <div className="flex items-center gap-1.5">
          <VaultTypeIcon type={vault.type} className="fill-foreground-subtle h-[20px] w-[20px]" />
          <span className="text-nowrap">{VAULT_TYPE_NAME_MAPPING[vault.type]}</span>
        </div>
      ),
      description: "TODO",
    },
  ];

  return (
    <div className="bg-euler-700/20 body-sm w-[224px] rounded-[8px] border py-2 shadow-lg backdrop-blur-md">
      <div className="flex gap-3 border-b px-3 pb-2">
        <TokenIcon
          symbol={vault.underlyingAssetSymbol}
          imgSrc={vault.underlyingAssetImgSrc}
          size={40}
          className="border-white/16 aspect-square shrink-0 border"
        />
        <div className="flex flex-col justify-center">
          <span>{vault.symbol}</span>
          <Link
            href={
              CHAIN_CONFIGS[vault.chainId].publicClient.chain?.blockExplorers?.default.url + `/address/${vault.address}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-semantic-accent body-xs flex hover:brightness-75"
          >
            {formatAddress({ address: vault.address })}
            <ArrowUpRight className="h-[16px] w-[16px]" />
          </Link>
        </div>
      </div>
      <div className="px-3 pt-1">
        {items.map((item, i) => (
          <div className="flex justify-between py-1" key={i}>
            <Popover>
              <PopoverTrigger className="border-border-strong border-b border-dashed">{item.title}</PopoverTrigger>
              <PopoverContent>{item.description}</PopoverContent>
            </Popover>
            <div className="text-foreground-subtle">{item.value}</div>
          </div>
        ))}
        <Button asChild className="mt-2">
          <Link href={`/${vault.chainId}/${vault.address}`} className="w-full">
            View vault
          </Link>
        </Button>
      </div>
    </div>
  );
}
