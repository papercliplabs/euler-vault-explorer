import TableFilterDrawer from "@/components/TableFilter/TableFilterDrawer";
import TableFilterToggle from "@/components/TableFilter/TableFilterToggle";
import VaultTable from "@/components/VaultTable";
import { vaultTableColumns } from "@/components/VaultTable/columns";
import { getAllVaults, getAllVaultsOffline } from "@/data/vault/getAllVaults";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex w-full flex-col gap-6 overflow-hidden p-[2px]">
      <h3>Vaults</h3>
      <div className="flex w-full gap-4">
        <Suspense>
          <TableFilterToggle />
        </Suspense>
        <span>XXX vaults</span>
        <div className="grow">SEARCH</div>
      </div>
      <div className="flex">
        <Suspense fallback={<div>Loading...</div>}>
          <TableFilterDrawer />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <VaultTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function VaultTableWrapper() {
  const allVaults = await getAllVaultsOffline();

  return <VaultTable data={allVaults} columns={vaultTableColumns} />;
}
