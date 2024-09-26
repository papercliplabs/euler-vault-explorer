"use server";
import { Vault, VaultCore } from "@/utils/types";
import { getOffchainVaultLabel } from "../../vaultOffchainLabel/getOffchainVaultLabel";
import { getRewards } from "@/data/rewards/getRewards";
import { formatUnits } from "viem";

export async function getVaultForVaultCore(
  vaultCore: VaultCore,
  underlyingAssetImgSrc: string | null,
  underlyingAssetPrice: number | null,
  unitOfAccountPrice: number | null
): Promise<Vault | null> {
  if (!vaultCore) {
    return null;
  }

  const [offchainLabel, rewards] = await Promise.all([
    getOffchainVaultLabel(vaultCore.chainId, vaultCore.address),
    getRewards(vaultCore.chainId, vaultCore.address),
  ]);

  let totalSuppliedUsd = undefined;
  let totalBorrowedUsd = undefined;
  if (underlyingAssetPrice != null) {
    // Go through underlying asset
    totalSuppliedUsd = vaultCore.totalSupplied * underlyingAssetPrice;
    totalBorrowedUsd = vaultCore.totalBorrowed * underlyingAssetPrice;
  } else if (vaultCore.underlyingAssetToUnitOfAccountPrice != undefined && unitOfAccountPrice != null) {
    // Go though unit of account
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

  const supplyRewards = [];
  if (rewards != null && underlyingAssetPrice != null) {
    const shareExchangeRate = vaultCore.totalSupplied / vaultCore.shares;
    const eTokenPrice = underlyingAssetPrice / shareExchangeRate;
    for (const reward of rewards) {
      supplyRewards.push({
        tokenSymbol: reward.tokenSymbol,
        tokenImgSrc: reward.tokenImgSrc,
        apy:
          reward.rewardsPerYearUsd /
          (Number(formatUnits(BigInt(reward.totalEligibleEtokens), vaultCore.vaultDecimals)) * eTokenPrice),
      });
    }
  }

  return {
    ...vaultCore,
    offchainLabel,

    underlyingAssetImgSrc,

    totalSuppliedUsd,
    totalBorrowedUsd,

    supplyRewards,
  };
}
