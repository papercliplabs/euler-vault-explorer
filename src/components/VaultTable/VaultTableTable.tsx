"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Vault } from "@/utils/types";
import SortIcon from "../Icons/special/SortChevrons";
import clsx from "clsx";
import { TableCell, TableRow, TableRowLink } from "./TableComponents";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

interface TableProps<TValue> {
  columns: ColumnDef<Vault, TValue>[];
  data: Vault[];
}

export default function VaultTableTable<TValue>({ data, columns }: TableProps<TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "totalSuppliedUsd",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualFiltering: true,
  });

  return (
    <ScrollSync>
      <div className="text-foreground-subtle h-fit w-full min-w-0">
        <div className="bg-background-base sticky top-[172px] z-20 min-w-full md:top-[136px]">
          <ScrollSyncPane>
            <div className="bg-background-subtle scrollbar-none overflow-auto overscroll-x-none rounded-t-[24px] border-x border-t">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-12">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell
                        minWidth={header.column.columnDef.minSize}
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="select-none hover:cursor-pointer"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon state={header.column.getIsSorted()} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </ScrollSyncPane>
        </div>
        <ScrollSyncPane>
          <div className="scrollbar-none flex w-full flex-col overflow-x-auto overscroll-x-none rounded-b-[24px] border-x border-b">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRowLink
                  href={`/${row.original.chainId}/${row.original.address}`}
                  className="bg-background-component hover:bg-background-subtle h-12 last:rounded-b-[24px]"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      minWidth={cell.column.columnDef.minSize}
                      key={cell.id}
                      className={clsx(cell.column.getIsSorted() && "bg-euler-700/20")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRowLink>
              ))
            ) : (
              <div className="bg-background-field flex h-[100px] items-center justify-center">No results.</div>
            )}
          </div>
        </ScrollSyncPane>
      </div>
    </ScrollSync>
  );
}
