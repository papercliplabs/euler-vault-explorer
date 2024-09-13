import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowUpRight({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M15.9284 8.07163L8.07168 15.9284M15.9284 8.07163L10.5858 8.07163M15.9284 8.07163L15.9284 13.4142"
        stroke="#728395"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
