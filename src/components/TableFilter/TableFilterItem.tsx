import { HTMLAttributes, ReactElement } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CheckBox from "../Icons/special/CheckBox";

export interface TableFilterItemBase {
  name: string;
  icon?: ReactElement;
  popoverText?: string;
}

interface TableFilterItemProps extends TableFilterItemBase, HTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

export function TableFilterItem({ name, icon, popoverText, checked, ...props }: TableFilterItemProps) {
  return (
    <button className="hover:bg-background-component flex items-center gap-2 px-2 py-1 text-start" {...props}>
      <CheckBox checked={checked} />
      {icon && icon}
      {popoverText ? (
        <Popover>
          <PopoverTrigger className="border-border-strong w-fit border-b border-dashed">{name}</PopoverTrigger>
          <PopoverContent>{popoverText}</PopoverContent>
        </Popover>
      ) : (
        <>{name}</>
      )}
    </button>
  );
}
