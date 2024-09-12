"use client";
import clsx from "clsx";
import { Accordion } from "../ui/accordion";
import { TableFilterSection } from "./TableFilterSection";
import {
  ALL_TABLE_FILTER_KEYS,
  FILTER_KEY_CHAIN,
  FILTER_KEY_COLLATERAL,
  FILTER_KEY_OPEN,
  FILTER_KEY_UNDERLYING_ASSET,
  FILTER_KEY_VAULT_TYPE,
} from "./filterKeys";
import { VAULT_TYPE_MATCH_ORDER, VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
import { ChainIcon, TokenIcon, VaultTypeIcon } from "../Icons";
import { TableFilterItemBase } from "./TableFilterItem";
import FilterClearButton from "../FilterClearButton";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { Vault } from "@/utils/types";
import { useMemo } from "react";
import { CHAIN_CONFIGS } from "@/config";

interface TraitFilterDrawerProps {
  vaults: Vault[];
}

const vaultTypeFilterItems: (TableFilterItemBase & { value: string })[] = VAULT_TYPE_MATCH_ORDER.map((type) => ({
  value: type,
  name: VAULT_TYPE_NAME_MAPPING[type],
  icon: <VaultTypeIcon type={type} className="h-6 w-6" />,
  //   popoverText: "TEST",
}));

const chainFilterItems: (TableFilterItemBase & { value: string })[] = Object.values(CHAIN_CONFIGS).map((config) => ({
  value: config.chainId.toString(),
  name: config.publicClient.chain?.name ?? "UNKNOWN",
  icon: <ChainIcon chainId={config.chainId} className="h-4 w-4" />,
}));

export default function TableFilterDrawer({ vaults }: TraitFilterDrawerProps) {
  const {
    values: [[open]],
  } = useShallowSearchParams({ keys: [FILTER_KEY_OPEN] });

  const underlyingAssetItems = useMemo(() => {
    const symbolToIconSrc: Record<string, string | null> = {};

    vaults.forEach((vault) => {
      symbolToIconSrc[vault.underlyingAssetSymbol] = vault.underlyingAssetImgSrc;
    });

    return Object.entries(symbolToIconSrc).map(([symbol, iconSrc]) => ({
      value: symbol,
      name: symbol,
      icon: <TokenIcon symbol={symbol} imgSrc={iconSrc} size={15} />,
    }));
  }, [vaults]);

  const collateralItems = useMemo(() => {
    const symbolToIconSrc: Record<string, string | null> = {};

    vaults.forEach((vault) => {
      symbolToIconSrc[vault.symbol] = vault.underlyingAssetImgSrc;
    });

    return Object.entries(symbolToIconSrc).map(([symbol, iconSrc]) => ({
      value: symbol,
      name: symbol,
      icon: <TokenIcon symbol={symbol} imgSrc={iconSrc} size={15} />,
    }));
  }, [vaults]);

  return (
    <div
      className={clsx(
        "relative h-fit shrink-0 overflow-hidden rounded-3xl transition-all",
        open ? "left-0 mr-6 w-[292px] border" : "-left-full mr-0 w-0 border-0"
      )}
    >
      <div className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-medium">Filter Vaults</span>
        <FilterClearButton filterKeys={ALL_TABLE_FILTER_KEYS} className="body-sm">
          Clear all
        </FilterClearButton>
      </div>
      <div>
        <Accordion type="multiple" defaultValue={ALL_TABLE_FILTER_KEYS}>
          <TableFilterSection
            name="Underlying asset"
            filterKey={FILTER_KEY_UNDERLYING_ASSET}
            items={underlyingAssetItems}
          />
          <TableFilterSection name="Collateral" filterKey={FILTER_KEY_COLLATERAL} items={collateralItems} />
          <TableFilterSection name="Vault type" filterKey={FILTER_KEY_VAULT_TYPE} items={vaultTypeFilterItems} />
          <TableFilterSection name="Chain" filterKey={FILTER_KEY_CHAIN} items={chainFilterItems} />
        </Accordion>
      </div>
    </div>
  );
}
