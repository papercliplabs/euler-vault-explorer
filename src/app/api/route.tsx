import { getCoinGeckoList } from "@/data/token/coinGecko/getCoinGeckoList";
import { getTokenPrices } from "@/data/token/getTokenPrices";
import { getAllVaults } from "@/data/vault/getAllVaults";
import { getAllVaultCores } from "@/data/vaultCore/getAllVaultCores";
import { zeroAddress } from "viem";

export async function GET() {
  // const vaults = await getAllVaults();
  // const data = await getAllVaults();
  // const data = await getTokenPrice("WBTC");
  // const data = await getTrustWalletTokenList(1);
  const data = await getAllVaults();

  // await getTokenImgSrc(1, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

  return Response.json({ data });
}
