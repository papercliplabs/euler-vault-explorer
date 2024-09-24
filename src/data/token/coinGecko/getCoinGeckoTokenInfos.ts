"use server";
import { SECONDS_PER_HOUR } from "@/utils/constants";
import { safeFetch, safeUnstableCache } from "@/utils/safeFetch";
import { cache } from "react";
import { CoinGeckoCoin, getCoinGeckoList } from "./getCoinGeckoList";

const BATCH_SIZE = 150;

export interface CoinGeckoTokenInfo {
  coinId: string; // for debugging

  symbol: string;
  imgSrc: string;
  priceUsd: number | null;
}

async function getCoinGeckoTokenInfosBatch(coinIds: string[]): Promise<CoinGeckoTokenInfo[]> {
  const url = new URL(`https://api.coingecko.com/api/v3/coins/markets`);
  const urlSearchParams = new URLSearchParams({
    vs_currency: "usd",
    ids: coinIds.join(","),
  });
  url.search = urlSearchParams.toString();

  const data = await safeFetch<{ id: string; symbol: string; image: string; current_price: number }[]>(url.toString(), {
    cache: "no-cache",
  });

  return data.map((d: any) => ({ coinId: d.id, symbol: d.symbol, imgSrc: d.image, priceUsd: d.current_price }));
}

async function getCoinGeckoTokenInfosForCoinIdsUncached(coinIds: string[]): Promise<CoinGeckoTokenInfo[]> {
  console.log("CACHE MISS: getCoinGeckoTokenInfosUncached", coinIds.length);
  const promises = [];
  for (let i = 0; i < coinIds.length; i += BATCH_SIZE) {
    const batch = coinIds.slice(i, i + BATCH_SIZE);
    promises.push(getCoinGeckoTokenInfosBatch(batch));
  }

  const results = await Promise.all(promises);
  return results.reduce((acc, r) => acc.concat(r), []);
}

const getCoinGeckoTokenInfosForCoinIds = cache(
  safeUnstableCache(getCoinGeckoTokenInfosForCoinIdsUncached, ["get-coin-gecko-token-info"], {
    revalidate: SECONDS_PER_HOUR,
  })
);

// Returns symbol (lower case) -> src
export async function getCoinGeckoTokenInfos(
  symbols: string[]
): Promise<Record<string, CoinGeckoTokenInfo | undefined>> {
  let coinList = await getCoinGeckoList();
  if (!coinList) {
    return {};
  }

  const symbolToCoin = coinList.reduce(
    (acc, coin) => {
      acc[coin.symbol] = coin;
      return acc;
    },
    {} as Record<string, CoinGeckoCoin | undefined>
  );

  const coinIdsSet = new Set<string>();
  for (const symbol of symbols) {
    const coin = symbolToCoin[symbol.toLowerCase()];
    if (coin) {
      coinIdsSet.add(coin.coinGeckoId);
    }
  }

  const coinIds = Array.from(coinIdsSet);

  let tokenInfos = await getCoinGeckoTokenInfosForCoinIds(coinIds);
  if (!tokenInfos) {
    return {};
  }

  return tokenInfos.reduce(
    (acc, tokenInfo) => {
      acc[tokenInfo.symbol.toLowerCase()] = tokenInfo;
      return acc;
    },
    {} as Record<string, CoinGeckoTokenInfo | undefined>
  );
}
