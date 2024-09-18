import { getTokenImgSrc } from "@/data/token/getTokenImgSrc";
import { getTokenPrice } from "@/data/token/getTokenPrice";
import { getCoinList } from "@/data/token/helpers/coinGecko";
import { getAllVaults } from "@/data/vault/getAllVaults";

export async function GET() {
  // const vaults = await getAllVaults();
  // const data = await getAllVaults();
  const data = await getTokenPrice("WBTC");

  // await getTokenImgSrc(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

  return Response.json({ data });
}
