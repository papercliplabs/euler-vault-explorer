"use client";
import { Vault } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { ChainIcon, TokenIcon, VaultTypeIcon } from "../Icons";
import { formatNumber } from "@/utils/format";
import { VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
import { CHAIN_CONFIGS } from "@/config";
import SortIcon from "../Icons/special/SortChevrons";

export const vaultTableColumns: ColumnDef<Vault>[] = [
  {
    accessorKey: "symbol",
    header: "Vault Name",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex items-center gap-3 font-medium">
          <TokenIcon symbol={vault.underlyingAssetSymbol} imgSrc={vault.underlyingAssetImgSrc} size={24} />
          <div>
            <span className="text-foreground-base">{vault.underlyingAssetSymbol}</span>{" "}
            <span className="text-foreground-subtle">{vault.symbol.split("-").pop()?.padStart(3, "0")}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalSupplied",
    header: "Total Supplied",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex flex-col">
          <span>
            {vault.totalSuppliedUsd == undefined
              ? "TODO"
              : formatNumber({ input: vault.totalSuppliedUsd, unit: "USD" })}
          </span>
          <span className="text-foreground-muted body-xs">
            {formatNumber({ input: vault.totalSupplied, unit: vault.underlyingAssetSymbol })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "supplyApy",
    header: "Supply APY",
    accessorFn: (vault) => formatNumber({ input: vault.supplyApy, unit: "%" }),
  },
  {
    accessorKey: "totalBorrowed",
    header: "Total Borrowed",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex flex-col">
          <span>
            {vault.totalBorrowedUsd == undefined
              ? "TODO"
              : formatNumber({ input: vault.totalBorrowedUsd, unit: "USD" })}
          </span>
          <span className="text-foreground-muted body-xs">
            {formatNumber({ input: vault.totalBorrowed, unit: vault.underlyingAssetSymbol })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "borrowApy",
    header: "Borrow APY",
    accessorFn: (vault) => formatNumber({ input: vault.borrowApy, unit: "%" }),
  },
  {
    accessorKey: "type",
    header: "Vault Type",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex items-center gap-2">
          <VaultTypeIcon type={vault.type} />
          <div>{VAULT_TYPE_NAME_MAPPING[vault.type]}</div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "chainId",
  //   header: "Chain",
  //   cell: ({ row }) => {
  //     const vault = row.original;
  //     return (
  //       <div className="flex items-center gap-2">
  //         <ChainIcon chainId={vault.chainId} className="h-4 w-4" />
  //         <div>{CHAIN_CONFIGS[vault.chainId].publicClient.chain?.name}</div>
  //       </div>
  //     );
  //   },
  // },
];
