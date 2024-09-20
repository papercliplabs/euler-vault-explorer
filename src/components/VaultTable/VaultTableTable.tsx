"use client";
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
import { ComponentProps, HTMLAttributes, HTMLProps, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Vault } from "@/utils/types";
import SortIcon from "../Icons/special/SortChevrons";
import clsx from "clsx";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { cn } from "@/utils/shadcn";
import Link from "next/link";

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

function TableRow({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={cn("flex w-full min-w-fit items-center border-b", className)} {...props} />;
}

function TableRowLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn("flex w-full min-w-fit items-center border-b", className)} prefetch={false} {...props} />;
}

interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  minWidth?: number;
}

function TableCell({ minWidth, className, style, ...props }: TableCellProps) {
  // shrink first col on mobile to allow more table to be displayed in resting position
  return (
    <div
      className={cn(
        "flex h-full w-[0px] flex-1 shrink-0 grow items-center overflow-hidden text-ellipsis text-nowrap px-4 first:!min-w-[240px] first:pl-6 last:pr-6",
        className
      )}
      style={{
        minWidth,
        ...style,
      }}
      {...props}
    />
  );
}
