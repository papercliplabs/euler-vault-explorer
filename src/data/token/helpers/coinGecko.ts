import { SupportedChainId } from "@/utils/types";
import { unstable_cache } from "next/cache";
import { Address, getAddress, isAddress, isAddressEqual } from "viem";
import { mainnet } from "viem/chains";

const platformMapping: Record<SupportedChainId, string> = {
  [mainnet.id]: "ethereum",
};

interface CoinGeckoCoin {
  chainId: SupportedChainId;
  address: Address;

  coinGeckoId: string;
  name: string;
  symbol: string;
}

async function getCoinListUncached(): Promise<CoinGeckoCoin[]> {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-gc-demo-api-key": process.env.COINGECKO_API_KEY!,
      },
      cache: "no-cache", // Don't cache this request, since over 2MB, use unstable cache around this instead
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
        const chainId = Object.keys(platformMapping).find(
          (chainId: any) => platformMapping[chainId as SupportedChainId] == platform
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
  } catch (e) {
    console.error("Error fetching Coin Gecko coin list", e);
    return [];
  }
}

export const getCoinList = unstable_cache(getCoinListUncached, ["get-coin-gecko-coin-list"]);

async function getCoinId(chainId: SupportedChainId, address: Address): Promise<string | null> {
  const coinList = await getCoinList();
  const coin = coinList.find((coin) => Number(coin.chainId) === Number(chainId) && coin.address == address);
  return coin?.coinGeckoId ?? null;
}

export async function getCoinGeckoTokenImgSrc(chainId: SupportedChainId, address: Address): Promise<string | null> {
  const coinId = await getCoinId(chainId, address);

  if (!coinId) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-gc-demo-api-key": process.env.COINGECKO_API_KEY!,
        },
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw new Error(`api/v3/coins/${coinId} bad response: ${response.statusText}`);
    }

    const data = (await response.json()) as { image?: { small: string; large: string } };
    const imgSrc = data.image?.large;

    return imgSrc ?? null;
  } catch (e) {
    console.error("Error fetching Coin Gecko token image", e);
    return null;
  }
}
