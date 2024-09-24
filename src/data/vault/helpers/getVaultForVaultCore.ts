"use server";
import { Vault, VaultCore } from "@/utils/types";
import { getOffchainVaultLabel } from "../../vaultOffchainLabel/getOffchainVaultLabel";

export async function getVaultForVaultCore(
  vaultCore: VaultCore,
  underlyingAssetImgSrc: string | null,
  underlyingAssetPrice: number | null,
  unitOfAccountPrice: number | null
): Promise<Vault | null> {
  if (!vaultCore) {
    return null;
  }

  const offchainLabel = await getOffchainVaultLabel(vaultCore.chainId, vaultCore.address);

  let totalSuppliedUsd = undefined;
  let totalBorrowedUsd = undefined;
  if (underlyingAssetPrice != null) {
    // Go through underlying asset
    totalSuppliedUsd = vaultCore.totalSupplied * underlyingAssetPrice;
    totalBorrowedUsd = vaultCore.totalBorrowed * underlyingAssetPrice;
  } else if (vaultCore.underlyingAssetToUnitOfAccountPrice != undefined && unitOfAccountPrice != null) {
    // Go though unit of accoun
    const totalSupplyInUnitOfAccount = vaultCore.totalSupplied * vaultCore.underlyingAssetToUnitOfAccountPrice;
    const totalBorrowedInUnitOfAccount = vaultCore.totalBorrowed * vaultCore.underlyingAssetToUnitOfAccountPrice;

    totalSuppliedUsd = totalSupplyInUnitOfAccount * unitOfAccountPrice;
    totalBorrowedUsd = totalBorrowedInUnitOfAccount * unitOfAccountPrice;
  } else {
    if (vaultCore.totalSupplied == 0) {
      totalSuppliedUsd = 0;
    }
    if (vaultCore.totalBorrowed == 0) {
      totalBorrowedUsd = 0;
    }
  }

  return {
    ...vaultCore,
    offchainLabel,

    underlyingAssetImgSrc,

    totalSuppliedUsd,
    totalBorrowedUsd,
  };
}
