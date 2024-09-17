import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowLeft({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M1.94434 7.49995H13.0554M1.94434 7.49995L5.72211 11.2777M1.94434 7.49995L5.72211 3.72217"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
