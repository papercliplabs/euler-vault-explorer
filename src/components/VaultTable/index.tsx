"use client";
import { useFilteredVaults } from "@/hooks/useFilteredVaults";
import { Vault } from "@/utils/types";
import { vaultTableColumns } from "./columns";
import VaultTableTable from "./VaultTableTable";

interface VaultTableProps {
  allVaults: Vault[];
}

export default function VaultTable({ allVaults }: VaultTableProps) {
  const filteredVaults = useFilteredVaults({ allVaults });
  return <VaultTableTable data={filteredVaults} columns={vaultTableColumns} />;
}
