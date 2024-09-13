import { cn } from "@/utils/shadcn";
import { SVGProps } from "react";

export default function ChevronDown({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("fill-foreground-base h-6 w-6", className)} {...props}>
      <path d="M14.5901 9.5C14.7532 9.50006 14.9132 9.53731 15.0535 9.60784C15.1939 9.67838 15.3093 9.77961 15.3877 9.90096C15.4662 10.0223 15.5048 10.1593 15.4995 10.2977C15.4943 10.436 15.4453 10.5706 15.3578 10.6874L12.7683 14.1421C12.6861 14.2518 12.5726 14.3421 12.4384 14.4046C12.3041 14.4672 12.1534 14.5 12.0003 14.5C11.8472 14.5 11.6965 14.4672 11.5623 14.4046C11.428 14.3421 11.3145 14.2518 11.2323 14.1421L8.64219 10.6874C8.55465 10.5706 8.50571 10.4359 8.50047 10.2976C8.49523 10.1592 8.5339 10.0221 8.61243 9.90074C8.69095 9.77937 8.80645 9.67815 8.94685 9.60765C9.08724 9.53715 9.24737 9.49997 9.41049 9.5H14.5901Z" />
    </svg>
  );
}