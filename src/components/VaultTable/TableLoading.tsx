import SortIcon from "../Icons/special/SortChevrons";
import { Skeleton } from "../ui/skeleton";
import { vaultTableColumns } from "./columns";
import { TableCell, TableRow } from "./TableComponents";

const NUM_ROWS = 100;

export default function TableLoading() {
  return (
    <div className="text-foreground-subtle h-fit w-full min-w-0">
      <div className="bg-background-base sticky top-[172px] z-20 min-w-full md:top-[136px]">
        <div className="bg-background-subtle scrollbar-none overflow-auto overscroll-x-none rounded-t-[24px] border-x border-t">
          <TableRow className="h-12">
            {vaultTableColumns.map((col, i) => (
              <TableCell minWidth={col.minSize} key={i}>
                {col.header as string}
                <SortIcon state={false} />
              </TableCell>
            ))}
          </TableRow>
        </div>
      </div>
      <div className="scrollbar-none flex w-full flex-col overflow-x-auto overscroll-x-none rounded-b-[24px] border-x border-b">
        {Array(NUM_ROWS)
          .fill(0)
          .map((_, i) => (
            <TableRow key={i} className="bg-background-component h-12 last:rounded-b-[24px]">
              {vaultTableColumns.map((col, i) => (
                <TableCell minWidth={col.minSize} key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
      </div>
    </div>
  );
}
