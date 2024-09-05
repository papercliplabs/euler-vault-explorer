import { getAllVaults } from "@/data/getAllVaults";

export async function GET() {
  const data = await getAllVaults();

  console.log("LENGHT", data.length);
  return Response.json({ vaults: data });
}
