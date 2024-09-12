import { Vault } from "@/utils/types";
import { useShallowSearchParams } from "./useShallowSearchParams";
import {
  FILTER_KEY_CHAIN,
  FILTER_KEY_COLLATERAL,
  FILTER_KEY_SEARCH,
  FILTER_KEY_UNDERLYING_ASSET,
  FILTER_KEY_VAULT_TYPE,
} from "@/components/TableFilter/filterKeys";
import { useMemo } from "react";

interface UseFilteredVaultsParams {
  allVaults: Vault[];
}

export function useFilteredVaults({ allVaults }: UseFilteredVaultsParams): Vault[] {
  const {
    values: [underlyingValues, collateralValues, vaultTypeValues, chainValues, searchValues],
  } = useShallowSearchParams({
    keys: [
      FILTER_KEY_UNDERLYING_ASSET,
      FILTER_KEY_COLLATERAL,
      FILTER_KEY_VAULT_TYPE,
      FILTER_KEY_CHAIN,
      FILTER_KEY_SEARCH,
    ],
  });

  const filteredVaults = useMemo(() => {
    return allVaults.filter((vault) => {
      const underlyingAssetMatch =
        underlyingValues.length === 0 || underlyingValues.includes(vault.underlyingAssetSymbol);
      const collateralMatch = collateralValues.length === 0 || collateralValues.includes(vault.symbol);
      const vaultTypeMatch = vaultTypeValues.length === 0 || vaultTypeValues.includes(vault.type);
      const chainMatch = chainValues.length === 0 || chainValues.includes(vault.chainId.toString());

      const searchValue = searchValues.length == 0 ? undefined : searchValues[0].toLowerCase();
      const searchMatch =
        !searchValue ||
        vault.name.toLowerCase().includes(searchValue) ||
        vault.symbol.toLowerCase().includes(searchValue) ||
        vault.address.toLowerCase().includes(searchValue) ||
        vault.underlyingAssetSymbol.toLowerCase().includes(searchValue) ||
        vault.underlyingAssetAddress.toLowerCase().includes(searchValue);

      return underlyingAssetMatch && collateralMatch && vaultTypeMatch && chainMatch && searchMatch;
    });
  }, [allVaults, underlyingValues, collateralValues, vaultTypeValues, chainValues, searchValues]);

  return filteredVaults;
}
