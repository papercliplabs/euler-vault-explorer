"use client";
import clsx from "clsx";
import { Accordion } from "../ui/accordion";
import { TableFilterSection } from "./TableFilterSection";
import {
  ALL_TABLE_FILTER_KEYS,
  FILTER_KEY_CHAIN,
  FILTER_KEY_COLLATERAL,
  FILTER_KEY_ENTITY,
  FILTER_KEY_OPEN,
  FILTER_KEY_UNDERLYING_ASSET,
  FILTER_KEY_VAULT_TYPE,
} from "./filterKeys";
import { VAULT_TYPE_INFO_MAPPING, VAULT_TYPE_MATCH_ORDER } from "@/utils/constants";
import { ChainIcon, TokenIcon, VaultTypeIcon } from "../Icons";
import { TableFilterItemBase } from "./TableFilterItem";
import FilterClearButton from "../FilterClearButton";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { Vault, VaultType } from "@/utils/types";
import { useMemo } from "react";
import { CHAIN_CONFIGS } from "@/config";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Button } from "../ui/button";
import { useFilteredVaults } from "@/hooks/useFilteredVaults";
import { getGraphKey } from "@/utils/graph";
import { useIsFilterDrawerOpen } from "@/hooks/useIsFilterDrawerOpen";

interface TraitFilterDrawerProps {
  vaults: Vault[];
}

const VAULT_TYPE_FILTERS: VaultType[] = ["escrowedCollateral", "governed", "ungoverned-0x", "factory"];

const vaultTypeFilterItems: (TableFilterItemBase & { value: string })[] = VAULT_TYPE_FILTERS.map((type) => ({
  value: type,
  name: VAULT_TYPE_INFO_MAPPING[type].name,
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
    values: [],
    removeShallowSearchParams,
  } = useShallowSearchParams({ keys: [] });

  const screenSize = useScreenSize();
  const filteredVaults = useFilteredVaults({ allVaults: vaults });

  const open = useIsFilterDrawerOpen();

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
    const keyToInfo: Record<string, { symbol: string; name: string; imgSrc: string | null }> = {};

    vaults.forEach((vault) => {
      keyToInfo[getGraphKey(vault.chainId, vault.address)] = {
        symbol: vault.underlyingAssetSymbol,
        name: `${vault.underlyingAssetSymbol} ${vault.id}`,
        imgSrc: vault.underlyingAssetImgSrc,
      };
    });

    return Object.entries(keyToInfo).map(([key, info]) => ({
      value: key, // Uses graph key, since this is unique chain + address
      name: info.name,
      icon: <TokenIcon symbol={info.symbol} imgSrc={info.imgSrc} size={15} />,
    }));
  }, [vaults]);

  const entityItems = useMemo(() => {
    const nameToIconSrc: Record<string, string | undefined> = {};

    vaults.forEach((vault) => {
      if (vault.offchainLabel) {
        nameToIconSrc[vault.offchainLabel.entityName] = vault.offchainLabel.entityLogo;
      }
    });

    return Object.entries(nameToIconSrc).map(([symbol, iconSrc]) => ({
      value: symbol,
      name: symbol,
      icon: iconSrc ? <TokenIcon symbol={symbol} imgSrc={iconSrc} size={15} /> : undefined,
    }));
  }, [vaults]);

  const content = (
    <>
      <div className="bg-background-base z-10 flex h-12 items-center justify-between rounded-t-3xl border-b px-6 py-4">
        <span className="text-nowrap font-medium">Filter Vaults</span>
        <FilterClearButton filterKeys={ALL_TABLE_FILTER_KEYS} className="body-sm text-nowrap">
          Clear all
        </FilterClearButton>
      </div>
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <Accordion type="multiple" defaultValue={[FILTER_KEY_UNDERLYING_ASSET]} className="h-fit">
          <TableFilterSection
            name="Underlying asset"
            filterKey={FILTER_KEY_UNDERLYING_ASSET}
            items={underlyingAssetItems}
          />
          <TableFilterSection name="Collateral" filterKey={FILTER_KEY_COLLATERAL} items={collateralItems} />
          <TableFilterSection name="Vault type" filterKey={FILTER_KEY_VAULT_TYPE} items={vaultTypeFilterItems} />
          <TableFilterSection name="Governing entity" filterKey={FILTER_KEY_ENTITY} items={entityItems} />
          {/* <TableFilterSection name="Chain" filterKey={FILTER_KEY_CHAIN} items={chainFilterItems} /> */}
        </Accordion>
      </div>
    </>
  );

  return screenSize == "sm" ? (
    <Drawer open={open} onClose={() => removeShallowSearchParams([FILTER_KEY_OPEN])} shouldScaleBackground>
      <DrawerContent>
        <div className="flex h-[calc(100dvh-30px)] flex-col justify-between overflow-hidden">
          <div className="flex h-full flex-col overflow-hidden">{content}</div>
          <div className="bg-background-base border-t px-6 py-4">
            <Button size="lg" className="w-full" onClick={() => removeShallowSearchParams([FILTER_KEY_OPEN])}>
              Show results ({filteredVaults.length} items)
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <div className={clsx("sticky top-[136px] h-[calc(100dvh-160px)] min-w-0 shrink-0 overflow-hidden transition-all")}>
      <div
        className={clsx(
          "flex max-h-full flex-col overflow-hidden rounded-3xl transition-all duration-200",
          open ? "mr-6 w-[292px] border" : "mr-0 w-0 border-0"
        )}
      >
        {content}
      </div>
    </div>
  );
}
