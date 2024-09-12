"use client";
import { useFilteredVaults } from "@/hooks/useFilteredVaults";
import { Vault } from "@/utils/types";

interface TableFilterCountParams {
  allVaults: Vault[];
}

export default function TableFilterCount({ allVaults }: TableFilterCountParams) {
  const filteredVaults = useFilteredVaults({ allVaults });

  return (
    <div className="body-sm text-foreground-muted w-[74px] shrink-0 text-nowrap text-center">
      {filteredVaults.length} vaults
    </div>
  );
}
