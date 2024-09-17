import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function X({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M11.25 3.75L3.75 11.25M3.75 3.75L11.25 11.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
