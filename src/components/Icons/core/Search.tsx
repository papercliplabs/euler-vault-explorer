import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Search({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M13.0554 13.0554L9.531 9.531M10.8332 6.38878C10.8332 8.84338 8.84338 10.8332 6.38878 10.8332C3.93418 10.8332 1.94434 8.84338 1.94434 6.38878C1.94434 3.93418 3.93418 1.94434 6.38878 1.94434C8.84338 1.94434 10.8332 3.93418 10.8332 6.38878Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
