import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowDown({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M7.66644 13.0554V1.94434M7.66644 13.0554L11.4442 9.27771M7.66644 13.0554L3.88867 9.27771"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
