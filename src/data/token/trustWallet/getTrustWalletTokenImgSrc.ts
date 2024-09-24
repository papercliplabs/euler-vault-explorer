import { SECONDS_PER_DAY, SECONDS_PER_WEEK } from "@/utils/constants";
import { safeUnstableCache } from "@/utils/safeFetch";
import { SupportedChainId } from "@/utils/types";
import { cache } from "react";

const TRUST_WALLET_ASSET_BASE_URL = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

const CHAIN_ID_TO_NAME_MAP: Record<SupportedChainId, string> = {
  1: "ethereum",
};

async function getTrustWalletTokenListUncached(
  chainId: SupportedChainId
): Promise<{ symbol: string; imgSrc: string }[]> {
  const url = `${TRUST_WALLET_ASSET_BASE_URL}/${CHAIN_ID_TO_NAME_MAP[chainId]}/tokenlist.json`;
  const resp = await fetch(url, {
    cache: "no-cache",
  });

  const data = (await resp.json())["tokens"] as { symbol: string; logoURI: string }[];

  return data.map((token) => ({ ...token, imgSrc: token.logoURI }));
}

const getTrustWalletTokenList = cache(
  safeUnstableCache(getTrustWalletTokenListUncached, ["get-trust-wallet-token-list"], { revalidate: SECONDS_PER_WEEK })
);

// Returns symbol (lower case) -> data
export async function getTrustWalletTokenImgSrcs(symbols: string[]): Promise<Record<string, string | undefined>> {
  const tokenList = await getTrustWalletTokenList(1);
  if (!tokenList) {
    return {};
  }

  const symbolToSrc = tokenList.reduce(
    (acc, entry) => {
      acc[entry.symbol] = entry.imgSrc;
      return acc;
    },
    {} as Record<string, string | undefined>
  );

  const imgSrcs: Record<string, string | undefined> = {};
  for (const symbol of symbols) {
    const src = symbolToSrc[symbol];
    if (src) {
      imgSrcs[symbol.toLowerCase()] = src;
    }
  }

  return imgSrcs;
}
