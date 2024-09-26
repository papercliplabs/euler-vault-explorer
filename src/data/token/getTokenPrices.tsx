"use server";
import { getCoinGeckoTokenInfos } from "./coinGecko/getCoinGeckoTokenInfos";
import { getRedstoneTokenPriceDatas } from "./redstore/getRedstoneTokenPrice";

export async function getTokenPrices(symbols: string[]): Promise<(number | null)[]> {
  const [coinGeckoData, redstoneData] = await Promise.all([
    getCoinGeckoTokenInfos(symbols),
    getRedstoneTokenPriceDatas(symbols.map((symbol) => (symbol.toLowerCase() == "weth" ? "eth" : symbol))),
  ]);

  let prices: (number | null)[] = [];

  for (const symbol of symbols) {
    const symbolLowerCase = symbol.toLowerCase();
    if (symbolLowerCase == "usd") {
      prices.push(1);
      continue;
    }

    const redstone = redstoneData?.[symbolLowerCase == "weth" ? "eth" : symbolLowerCase];
    const coinGecko = coinGeckoData[symbolLowerCase == "eth" ? "weth" : symbolLowerCase];

    if (redstone) {
      prices.push(redstone.value);
    } else if (coinGecko && coinGecko.priceUsd) {
      prices.push(coinGecko.priceUsd);
    } else {
      console.error("getTokenPrices: no price found", symbolLowerCase);
      prices.push(null);
    }
  }

  return prices;
}
