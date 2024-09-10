import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Check({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("stroke-foreground-base h-6 w-6", className)} {...props}>
      <path
        d="M7.53613 12.1786L10.3933 15.75L16.4647 8.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
