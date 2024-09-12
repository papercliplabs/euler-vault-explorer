import { Vault } from "@/utils/types";
import { useShallowSearchParams } from "./useShallowSearchParams";
import {
  FILTER_KEY_CHAIN,
  FILTER_KEY_COLLATERAL,
  FILTER_KEY_UNDERLYING_ASSET,
  FILTER_KEY_VAULT_TYPE,
} from "@/components/TableFilter/filterKeys";
import { useMemo } from "react";

interface UseFilteredVaultsParams {
  allVaults: Vault[];
}

export function useFilteredVaults({ allVaults }: UseFilteredVaultsParams): Vault[] {
  const {
    values: [underlyingValues, collateralValues, vaultTypeValues, chainValues],
  } = useShallowSearchParams({
    keys: [FILTER_KEY_UNDERLYING_ASSET, FILTER_KEY_COLLATERAL, FILTER_KEY_VAULT_TYPE, FILTER_KEY_CHAIN],
  });

  const filteredVaults = useMemo(() => {
    return allVaults.filter((vault) => {
      const underlyingAssetMatch =
        underlyingValues.length === 0 || underlyingValues.includes(vault.underlyingAssetSymbol);
      const collateralMatch = collateralValues.length === 0 || collateralValues.includes(vault.symbol);
      const vaultTypeMatch = vaultTypeValues.length === 0 || vaultTypeValues.includes(vault.type);
      const chainMatch = chainValues.length === 0 || chainValues.includes(vault.chainId.toString());

      return underlyingAssetMatch && collateralMatch && vaultTypeMatch && chainMatch;
    });
  }, [allVaults, underlyingValues, collateralValues, vaultTypeValues, chainValues]);

  console.log(underlyingValues, collateralValues, vaultTypeValues, chainValues, filteredVaults);

  return filteredVaults;
}
