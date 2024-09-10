import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Expand({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M6.84375 17.1562V14.3438M6.84375 17.1562H9.65625M6.84375 17.1562L10.125 13.875M17.1562 6.84375H14.3438M17.1562 6.84375V9.65625M17.1562 6.84375L13.875 10.125"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
