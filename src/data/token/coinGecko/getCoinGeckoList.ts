import { SECONDS_PER_DAY } from "@/utils/constants";
import { safeUnstableCache } from "@/utils/safeFetch";
import { SupportedChainId } from "@/utils/types";
import { cache } from "react";
import { Address, getAddress, isAddress } from "viem";
import { mainnet } from "viem/chains";

const CHAIN_ID_TO_PLATFORM_MAP: Record<SupportedChainId, string> = {
  [mainnet.id]: "ethereum",
};

export interface CoinGeckoCoin {
  chainId: SupportedChainId;
  address: Address;

  coinGeckoId: string;
  name: string;
  symbol: string;
}

async function getCoinGeckoListUncached(): Promise<CoinGeckoCoin[]> {
  console.log("CACHE MISS: getCoinGeckoListUncached");
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-gc-demo-api-key": process.env.COINGECKO_API_KEY!,
    },
    //   cache: "no-cache", // Don't cache this request, since over 2MB, use unstable cache around this instead
  });

  if (!response.ok) {
    throw new Error(`api/v3/coins/list bad response: ${response.statusText}`);
  }

  const rawList = (await response.json()) as {
    id: string;
    symbol: string;
    name: string;
    platforms: Record<string, string>;
  }[];

  const list: CoinGeckoCoin[] = [];
  for (const coin of rawList) {
    for (const [platform, address] of Object.entries(coin.platforms)) {
      const chainId = Object.keys(CHAIN_ID_TO_PLATFORM_MAP).find(
        (chainId: any) => CHAIN_ID_TO_PLATFORM_MAP[chainId as SupportedChainId] == platform
      );
      if (chainId && isAddress(address)) {
        list.push({
          chainId: Number(chainId) as SupportedChainId,
          address: getAddress(address),
          coinGeckoId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
        });
      }
    }
  }

  return list;
}

export const getCoinGeckoList = cache(
  safeUnstableCache(getCoinGeckoListUncached, ["get-coin-gecko-coin-list"], {
    revalidate: SECONDS_PER_DAY,
  })
);
