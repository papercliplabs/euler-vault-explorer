import { getCoinList } from "@/data/token/helpers/coinGecko";
import { getAllVaults } from "@/data/vault/getAllVaults";

export async function GET() {
  // const vaults = await getAllVaults();
  const data = await getAllVaults();

  return Response.json({ data });
}
