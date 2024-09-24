"use server";
import { getCoinGeckoTokenInfos } from "./coinGecko/getCoinGeckoTokenInfos";
import { getRedstoneTokenPriceDatas } from "./redstore/getRedstoneTokenPrice";

export async function getTokenPrices(symbols: string[]): Promise<(number | null)[]> {
  const [coinGeckoData, redstoneData] = await Promise.all([
    getCoinGeckoTokenInfos(symbols),
    getRedstoneTokenPriceDatas(symbols.map((symbol) => (symbol == "WETH" ? "ETH" : symbol))),
  ]);

  let prices: (number | null)[] = [];

  for (const symbol of symbols) {
    if (symbol == "USD") {
      prices.push(1);
      continue;
    }

    const redstone = redstoneData?.[symbol == "WETH" ? "ETH" : symbol];
    const coinGecko = coinGeckoData[symbol == "ETH" ? "WETH" : symbol];

    if (redstone) {
      prices.push(redstone.value);
    } else if (coinGecko && coinGecko.priceUsd) {
      prices.push(coinGecko.priceUsd);
    } else {
      console.error("getTokenPrices: no price found", symbol);
      prices.push(null);
    }
  }

  return prices;
}
