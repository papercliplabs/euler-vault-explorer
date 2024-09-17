import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Check({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M3.03613 7.67857L5.89328 11.25L11.9647 3.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
