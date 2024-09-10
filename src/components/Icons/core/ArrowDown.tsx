import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowDown({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M12.1664 17.5554V6.44434M12.1664 17.5554L15.9442 13.7777M12.1664 17.5554L8.38867 13.7777"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
