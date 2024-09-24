import TableFilterCount from "@/components/TableFilter/TableFilterCount";
import TableFilterDrawer from "@/components/TableFilter/TableFilterDrawer";
import TableFilterSearch from "@/components/TableFilter/TableFilterSearch";
import TableFilterToggle from "@/components/TableFilter/TableFilterToggle";
import { Skeleton } from "@/components/ui/skeleton";
import VaultTable from "@/components/VaultTable";
import TableLoading from "@/components/VaultTable/TableLoading";
import { getAllVaults } from "@/data/vault/getAllVaults";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex w-full flex-col gap-0 pt-4 md:gap-2 md:pt-6">
      <h3>Vaults</h3>
      <div className="bg-background-base sticky top-[64px] z-10 flex w-full flex-col justify-start gap-4 py-4 md:flex-row md:items-center">
        <div className="flex grow items-center justify-start gap-4">
          <Suspense>
            <TableFilterToggle />
          </Suspense>
          <Suspense>
            <TableFilterSearch />
          </Suspense>
        </div>
        <Suspense fallback={<Skeleton className="h-[20px] w-[74px] shrink-0" />}>
          <TableFilterCountWrapper />
        </Suspense>
      </div>
      <div className="flex transition-all">
        <Suspense fallback={<TableLoading />}>
          <VaultTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function VaultTableWrapper() {
  const allVaults = await getAllVaults();

  return (
    <>
      <TableFilterDrawer vaults={allVaults} />
      <VaultTable allVaults={allVaults} />
    </>
  );
}

async function TableFilterCountWrapper() {
  const allVaults = await getAllVaults();

  return (
    <>
      <TableFilterCount allVaults={allVaults} />
    </>
  );
}
