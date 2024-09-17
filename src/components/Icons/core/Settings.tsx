import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Settings({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M12.6111 7.5H13.5M1.5 7.5H9.94444M7.72222 3.27778H13.5M1.5 3.27778H5.05556M7.72222 11.7222H13.5M1.5 11.7222H5.05556M9.94444 5.72222V9.27778M5.05556 1.5V5.05556M5.05556 9.94444V13.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
