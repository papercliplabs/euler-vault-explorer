import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowUpRight({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M11.5353 3.67832L3.67851 11.5351M11.5353 3.67832H6.19267M11.5353 3.67832V9.0209"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
