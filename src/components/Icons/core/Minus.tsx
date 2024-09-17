import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Minus({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path d="M2.5 7.5H12.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
