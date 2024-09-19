"use client";
import { Vault } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { VaultTypeIcon } from "../Icons";
import { formatNumber, formatVaultName } from "@/utils/format";
import { VAULT_TYPE_INFO_MAPPING } from "@/utils/constants";
import clsx from "clsx";
import { VaultIcon } from "../Icons/special/VaultIcon";

export const vaultTableColumns: ColumnDef<Vault>[] = [
  {
    accessorKey: "symbol",
    header: "Vault Name",
    cell: ({ row }) => {
      const vault = row.original;
      const offchainName = vault.offchainLabel?.name;
      return (
        <div className="text-foreground-base flex items-center gap-3 font-medium">
          <VaultIcon vault={vault} size={28} badgeType="entity" />
          <div className="flex flex-col">
            <span>{offchainName}</span>
            <div className={clsx(offchainName && "body-xs text-foreground-muted")}>
              {formatVaultName({ vault, removeStyle: !!offchainName })}
            </div>
          </div>
        </div>
      );
    },
    minSize: 300,
  },
  {
    accessorKey: "totalSuppliedUsd",
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
    minSize: 200,
  },
  {
    accessorKey: "supplyApy",
    header: "Supply APY",
    accessorFn: (vault) => formatNumber({ input: vault.supplyApy, unit: "%" }),
    minSize: 140,
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
    minSize: 200,
  },
  {
    accessorKey: "borrowApy",
    header: "Borrow APY",
    accessorFn: (vault) => formatNumber({ input: vault.borrowApy, unit: "%" }),
    minSize: 140,
  },
  {
    accessorKey: "type",
    header: "Vault Type",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex items-center gap-2">
          <VaultTypeIcon type={vault.type} />
          <div>{VAULT_TYPE_INFO_MAPPING[vault.type].name}</div>
        </div>
      );
    },
    minSize: 200,
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
