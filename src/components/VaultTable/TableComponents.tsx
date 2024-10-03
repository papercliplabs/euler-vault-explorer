"use client";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { ComponentProps, HTMLAttributes, HTMLProps, ReactNode } from "react";

export function TableRow({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={cn("flex w-full min-w-fit items-center border-b", className)} {...props} />;
}

export function TableRowLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn("flex w-full min-w-fit items-center border-b", className)} prefetch={false} {...props} />;
}

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  minWidth?: number;
}

export function TableCell({ minWidth, className, style, ...props }: TableCellProps) {
  // shrink first col on mobile to allow more table to be displayed in resting position
  return (
    <div
      className={cn(
        "flex h-full w-[0px] flex-1 shrink-0 grow items-center overflow-hidden text-ellipsis text-nowrap px-4 first:pl-6 last:pr-6 sm:max-md:first:!min-w-[240px]",
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
