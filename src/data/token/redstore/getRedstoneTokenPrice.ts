import { SECONDS_PER_HOUR } from "@/utils/constants";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import redstone from "redstone-api";
import { PriceData } from "redstone-api/lib/types";

// Returns symbol (lower case) -> data
async function getRedstoneTokenPriceDatasUncached(symbols: string[]): Promise<Record<string, PriceData | undefined>> {
  console.log("CACHE MISS: getRedstoneTokenPriceDatasUncached", symbols.length);
  const priceData = await redstone.query().symbols(symbols).latest().exec();
  return priceData;
}

export const getRedstoneTokenPriceDatas = cache(
  unstable_cache(getRedstoneTokenPriceDatasUncached, ["get-redstone-token-price"], { revalidate: SECONDS_PER_HOUR })
);
