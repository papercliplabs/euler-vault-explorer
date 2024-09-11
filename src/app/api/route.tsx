import { getAllVaults } from "@/data/vault/getAllVaults";

export async function GET() {
  const vaults = await getAllVaults();

  return Response.json({ vaults });
}
