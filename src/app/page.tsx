import { getAllVaults } from "@/data/getAllVaults";
import { getAllVaultsStub } from "@/data/getAllVaultsStub";

export default async function Home() {
  const allVaults = await getAllVaultsStub();
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      {allVaults.map((vault) => JSON.stringify(vault))}
    </main>
  );
}
