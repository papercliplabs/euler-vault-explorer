import { SECONDS_PER_WEEK } from "@/utils/constants";
import { SupportedChainId } from "@/utils/types";

const TRUST_WALLET_ASSET_BASE_URL = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

const CHAIN_ID_TO_NAME_MAP: Record<SupportedChainId, string> = {
  1: "ethereum",
};

export async function getTrustWalletTokenList(
  chainId: SupportedChainId
): Promise<{ symbol: string; imgSrc: string }[] | null> {
  try {
    const url = `${TRUST_WALLET_ASSET_BASE_URL}/${CHAIN_ID_TO_NAME_MAP[chainId]}/tokenlist.json`;
    const resp = await fetch(url, {
      next: { revalidate: SECONDS_PER_WEEK },
    });

    const data = (await resp.json())["tokens"] as { symbol: string; logoURI: string }[];

    return data.map((token) => ({ ...token, imgSrc: token.logoURI }));
  } catch (e) {
    console.error("Error fetching Trust Wallet token list", e);
    return null;
  }
}

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
