import { Vault } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { TokenIcon, VaultTypeIcon } from "../Icons";
import { formatNumber, formatVaultName } from "@/utils/format";
import { VAULT_TYPE_INFO_MAPPING } from "@/utils/constants";
import clsx from "clsx";
import { VaultIcon } from "../Icons/special/VaultIcon";
import Stars from "../Icons/core/Stars";
import TooltipPopover from "../ui/tooltipPopover";
import SupplyApyTooltipPopover from "../SupplyApyTooltipPopover";

const SMALL_NON_ZERO_VAL = 0.001;

export const vaultTableColumns: ColumnDef<Vault>[] = [
  {
    accessorKey: "symbol",
    header: "Vault Name",
    cell: ({ row }) => {
      const vault = row.original;
      const offchainName = vault.offchainLabel?.name;
      return (
        <div className="text-foreground-base flex max-w-full items-center gap-3 font-medium">
          <VaultIcon vault={vault} size={28} badgeType="entity" keepPadding />
          <div className="flex min-w-0 flex-col">
            <span className="truncate">{offchainName}</span>
            <div className={clsx("truncate", offchainName && "body-xs text-foreground-muted")}>
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
              ? "-"
              : formatNumber({ input: vault.totalSuppliedUsd, unit: "USD", compact: true })}
          </span>
          <span className="text-foreground-muted body-xs">
            {formatNumber({ input: vault.totalSupplied, unit: vault.underlyingAssetSymbol, compact: true })}
          </span>
        </div>
      );
    },
    minSize: 160,
    sortingFn: (a, b) => {
      const aVal = a.original.totalSuppliedUsd ?? SMALL_NON_ZERO_VAL;
      const bVal = b.original.totalSuppliedUsd ?? SMALL_NON_ZERO_VAL;

      return aVal > bVal ? 1 : -1;
    },
    sortUndefined: undefined,
  },
  {
    accessorKey: "supplyApy",
    header: "Supply APY",
    cell: ({ row }) => {
      const vault = row.original;
      const hasRewards = vault.supplyRewards.length > 0;
      const netSupplyApy = vault.supplyApy + vault.supplyRewards.reduce((acc, reward) => acc + reward.apy, 0);
      return hasRewards ? (
        <SupplyApyTooltipPopover supplyApy={vault.supplyApy} rewards={vault.supplyRewards} />
      ) : (
        <div>{formatNumber({ input: netSupplyApy, unit: "%" })}</div>
      );
    },
    sortingFn: (a, b) => {
      const aVal = a.original.supplyApy + a.original.supplyRewards.reduce((acc, reward) => acc + reward.apy, 0);
      const bVal = b.original.supplyApy + b.original.supplyRewards.reduce((acc, reward) => acc + reward.apy, 0);

      return aVal > bVal ? 1 : -1;
    },
    minSize: 140,
  },
  {
    accessorKey: "totalBorrowed",
    header: "Total Borrowed",
    cell: ({ row }) => {
      const vault = row.original;
      return (
        <div className="flex min-w-0 flex-col">
          <span>
            {vault.totalBorrowedUsd == undefined
              ? "-"
              : formatNumber({ input: vault.totalBorrowedUsd, unit: "USD", compact: true })}
          </span>
          <span className="text-foreground-muted body-xs truncate">
            {formatNumber({ input: vault.totalBorrowed, unit: vault.underlyingAssetSymbol, compact: true })}
          </span>
        </div>
      );
    },
    minSize: 160,
    sortingFn: (a, b) => {
      const aVal = a.original.totalBorrowedUsd ?? SMALL_NON_ZERO_VAL;
      const bVal = b.original.totalBorrowedUsd ?? SMALL_NON_ZERO_VAL;

      return aVal > bVal ? 1 : -1;
    },
    sortUndefined: undefined,
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
    minSize: 150,
  },
  {
    accessorKey: "offchainLabel.name",
    header: "Governing Entity",
    cell: ({ row }) => {
      const vault = row.original;
      const offchainLabel = vault.offchainLabel;
      return (
        <div className="flex min-w-0 items-center gap-2">
          {offchainLabel ? (
            <>
              {offchainLabel.entityLogo && (
                <TokenIcon symbol={offchainLabel.name} imgSrc={offchainLabel.entityLogo} size={20} />
              )}
              <span className="truncate">{vault.offchainLabel?.entityName}</span>
            </>
          ) : (
            <>{vault.type == "governed" || vault.type == "factory" ? "Unknown" : "None"}</>
          )}
        </div>
      );
    },
    minSize: 180,
  },
];
