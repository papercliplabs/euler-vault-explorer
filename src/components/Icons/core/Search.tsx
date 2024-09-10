import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function Search({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("stroke-foreground-base h-6 w-6", className)} {...props}>
      <path
        d="M17.5554 17.5554L14.031 14.031M15.3332 10.8888C15.3332 13.3434 13.3434 15.3332 10.8888 15.3332C8.43418 15.3332 6.44434 13.3434 6.44434 10.8888C6.44434 8.43418 8.43418 6.44434 10.8888 6.44434C13.3434 6.44434 15.3332 8.43418 15.3332 10.8888Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
