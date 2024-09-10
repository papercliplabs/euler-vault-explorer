import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ArrowRight({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M17.5554 11.9999H6.44434M17.5554 11.9999L13.7777 8.22217M17.5554 11.9999L13.7777 15.7777"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
