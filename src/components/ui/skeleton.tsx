import { cn } from "@/utils/shadcn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-euler-600 animate-pulse rounded-[4px]", className)} {...props} />;
}

export { Skeleton };
