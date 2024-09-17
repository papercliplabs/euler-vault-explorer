"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
  Row,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Vault } from "@/utils/types";
import SortIcon from "../Icons/special/SortChevrons";
import clsx from "clsx";

interface TableProps<TValue> {
  columns: ColumnDef<Vault, TValue>[];
  data: Vault[];
}

export default function VaultTableTable<TValue>({ data, columns }: TableProps<TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "totalSupplied",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualFiltering: true,
  });

  const handleRowClick = useCallback(
    (row: Row<Vault>) => {
      router.push(`/${row.original.chainId}/${row.original.address}`);
    },
    [router]
  );

  return (
    <div className="bg-background-component sticky top-0 h-fit grow overflow-y-auto rounded-[24px] border">
      <table className="h-full w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="bg-background-subtle z-10 hover:brightness-100">
                    <div
                      className="text-foreground-subtle flex w-fit select-none items-center text-nowrap hover:cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon state={header.column.getIsSorted()} />
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={clsx("hover:bg-background-subtle body-sm text-foreground-subtle hover:cursor-pointer")}
                tabIndex={1}
                onClick={() => handleRowClick(row)}
                onKeyDown={(event) => {
                  event.key === "Enter" && handleRowClick(row);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={clsx("text-nowrap", cell.column.getIsSorted() && "bg-euler-700/20")}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </table>
    </div>
  );
}
