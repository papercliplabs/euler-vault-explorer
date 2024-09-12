import { cn } from "@/utils/shadcn";
import { HTMLAttributes } from "react";
import Check from "../core/Check";

interface CheckBoxProps extends HTMLAttributes<HTMLDivElement> {
  checked: boolean;
}

export default function CheckBox({ checked, className, ...props }: CheckBoxProps) {
  return (
    <div className="relative h-[20px] w-[20px] p-[2px]">
      <div
        className={cn(
          "bg-background-component relative h-full w-full rounded-[4px] border-2",
          checked && "bg-semantic-accent border-teal-300",
          className
        )}
        {...props}
      />
      {checked && <Check className="stroke-euler-100 absolute left-0 top-0 h-[20px] w-[20px]" />}
    </div>
  );
}
