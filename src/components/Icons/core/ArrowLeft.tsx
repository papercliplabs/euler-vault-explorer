import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowLeft({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M6.44434 11.9999H17.5554M6.44434 11.9999L10.2221 15.7777M6.44434 11.9999L10.2221 8.22217"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
