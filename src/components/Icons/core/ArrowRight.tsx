import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowRight({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M13.0554 7.49995H1.94434M13.0554 7.49995L9.27767 3.72217M13.0554 7.49995L9.27767 11.2777"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
