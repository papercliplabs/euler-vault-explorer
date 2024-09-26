import { SECONDS_PER_DAY, SECONDS_PER_YEAR } from "@/utils/constants";
import { safeFetch, safeUnstableCache } from "@/utils/safeFetch";
import { BigIntString, SupportedChainId } from "@/utils/types";
import { Address, formatUnits, getAddress, isAddress } from "viem";

type RewardApiResponseFormat = Record<
  string, // Vault address
  Record<
    string, // Reward token address
    {
      rewardSymbol: string;
      rewardDecimals: number;
      rewardPrice: number;
      rewardLogo: string;

      rewardAmount: BigIntString; // per epoch
      epochDuration: number; // seconds

      totalRewardedEligible: BigIntString;

      currentEpoch: number;
      lastEpoch: number;
    }
  >
>;

interface Reward {
  tokenSymbol: string;
  tokenImgSrc: string;
  rewardsPerYearUsd: number;
  totalEligibleEtokens: BigIntString;
}

// Vault Address -> Reward[]
async function getRewardsForChainUncached(chainId: SupportedChainId): Promise<Record<Address, Reward[]>> {
  const data = await safeFetch<RewardApiResponseFormat>(`https://app.euler.finance/api/v1/rewards?chainId=${chainId}`, {
    next: { revalidate: 0 },
  });

  const rewards: Record<Address, Reward[]> = Object.keys(data).reduce(
    (acc, vaultAddressStr) => {
      if (!isAddress(vaultAddressStr)) {
        return acc; // Has some other rand fields
      }

      const vaultAddress = getAddress(vaultAddressStr);
      acc[vaultAddress] = [];

      Object.keys(data[vaultAddress]).forEach((rewardTokenAddress) => {
        const rewardData = data[vaultAddress][rewardTokenAddress];
        const rewardsPerYearUsd = computeRewardsPerYearUsd(
          rewardData.epochDuration,
          BigInt(rewardData.rewardAmount),
          rewardData.rewardDecimals,
          rewardData.rewardPrice
        );

        acc[vaultAddress].push({
          tokenSymbol: rewardData.rewardSymbol,
          tokenImgSrc: rewardData.rewardLogo,
          rewardsPerYearUsd,
          totalEligibleEtokens: rewardData.totalRewardedEligible,
        } as Reward);
      });
      return acc;
    },
    {} as Record<Address, Reward[]>
  );

  return rewards;
}

function computeRewardsPerYearUsd(
  epochDuration: number,
  rewardAmount: bigint,
  rewardDecimals: number,
  rewardTokenPriceUsd: number
): number {
  if (epochDuration == 0) {
    return 0;
  } else {
    return Number(formatUnits(rewardAmount, rewardDecimals)) * rewardTokenPriceUsd * (SECONDS_PER_YEAR / epochDuration);
  }
}

const getRewardsForChain = safeUnstableCache(getRewardsForChainUncached, ["get-rewards-for-chain"], {
  revalidate: SECONDS_PER_DAY,
});

export async function getRewards(chainId: SupportedChainId, vaultAddress: Address): Promise<Reward[] | null> {
  const allRewards = await getRewardsForChain(chainId);

  return allRewards?.[vaultAddress] ?? null;
}
