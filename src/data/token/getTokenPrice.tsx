"use server";
import { SECONDS_PER_HOUR } from "@/utils/constants";
import { unstable_cache } from "next/cache";
import redstone from "redstone-api";

async function getTokenPriceUncached(symbol: string) {
  try {
    const price = await redstone.getPrice(symbol == "WETH" ? "ETH" : symbol);
    return price.value;
  } catch (e) {
    console.error("getTokenPrice error", e);
    return 0;
  }
}

export const getTokenPrice = unstable_cache(getTokenPriceUncached, ["get-token-price"], {
  revalidate: SECONDS_PER_HOUR,
});
