"use client";
import { Vault } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { TokenIcon, VaultTypeIcon } from "../Icons";
import { formatNumber } from "@/utils/format";
import { VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
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
          {/* <TokenIcon symbol={vault.underlyingAssetSymbol} imgSrc={vault.underlyingAssetImgSrc} size={24} /> */}
          <VaultIcon vault={vault} size={28} badgeType="entity" />
          <div className="flex flex-col">
            <span>{offchainName}</span>
            <div className={clsx(offchainName && "body-xs text-foreground-muted")}>
              <span>{vault.underlyingAssetSymbol}</span>{" "}
              <span className={clsx(!offchainName && "text-foreground-subtle")}>{vault.id}</span>
            </div>
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
