import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Plus({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path d="M12 7V17M7 12H17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
