"use client";
import { useFilteredVaults } from "@/hooks/useFilteredVaults";
import { Vault } from "@/utils/types";

interface TableFilterCountParams {
  allVaults: Vault[];
}

export default function TableFilterCount({ allVaults }: TableFilterCountParams) {
  const filteredVaults = useFilteredVaults({ allVaults });

  return (
    <div className="body-xs flex shrink-0 gap-1 text-nowrap md:w-[74px] md:flex-col md:items-end md:justify-center md:gap-0">
      <span className="text-foreground-muted">Showing</span>
      <span>{filteredVaults.length} vaults</span>
    </div>
  );
}
