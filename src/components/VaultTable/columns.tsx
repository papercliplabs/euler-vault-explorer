"use client";
import { Vault } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const vaultTableColumns: ColumnDef<Vault>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Vault Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalSupplied",
    header: "Total Supplied",
  },
  {
    accessorKey: "supplyApy",
    header: "Supply APY",
  },
  {
    accessorKey: "totalBorrowed",
    header: "Total Borrowed",
  },
  {
    accessorKey: "borrowApy",
    header: "Borrow APY",
  },
  {
    accessorKey: "type",
    header: "Vault Type",
  },
  {
    accessorKey: "chainId",
    header: "Chain",
  },
];
