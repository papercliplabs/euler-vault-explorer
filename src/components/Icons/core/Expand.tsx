import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Expand({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      className={cn("fill-foreground-base stroke-foreground-base h-6 w-6 p-[4.5px]", className)}
      {...props}
    >
      <path
        d="M2.34375 12.6562V9.84375M2.34375 12.6562H5.15625M2.34375 12.6562L5.625 9.375M12.6562 2.34375H9.84375M12.6562 2.34375V5.15625M12.6562 2.34375L9.375 5.625"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
