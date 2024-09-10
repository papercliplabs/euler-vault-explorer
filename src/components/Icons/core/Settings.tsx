import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Settings({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6", className)}
      {...props}
    >
      <path
        d="M17.1111 12H18M6 12H14.4444M12.2222 7.77778H18M6 7.77778H9.55556M12.2222 16.2222H18M6 16.2222H9.55556M14.4444 10.2222V13.7778M9.55556 6V9.55556M9.55556 14.4444V18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
