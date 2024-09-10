import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function X({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M15.75 8.25L8.25 15.75M8.25 8.25L15.75 15.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
