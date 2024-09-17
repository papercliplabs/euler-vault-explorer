"use client";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCallback, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { TableFilterItem, TableFilterItemBase } from "./TableFilterItem";
import FilterClearButton from "../FilterClearButton";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";

const MIN_ITEMS_FOR_SEARCH = 6;

interface TableFilterSectionProps {
  name: string;
  filterKey: string;
  items: (TableFilterItemBase & { value: string })[];
}

export function TableFilterSection({ name, filterKey, items }: TableFilterSectionProps) {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);

  const {
    addShallowSearchParams,
    values: [filterValues],
  } = useShallowSearchParams({ keys: [filterKey] });

  const searchFilteredItems = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(searchFilter.toLowerCase()));
  }, [items, searchFilter]);

  const handleFilterChange = useCallback(
    (value: string, set: boolean) => {
      const newValues = [...filterValues];

      const index = newValues.indexOf(value);
      if (set && index === -1) {
        newValues.push(value);
      } else if (!set && index !== -1) {
        newValues.splice(index, 1);
      } else {
        // No work to do
        return;
      }

      addShallowSearchParams([{ key: filterKey, value: newValues }]);
    },
    [filterValues, addShallowSearchParams, filterKey]
  );

  const isHidingItems = useMemo(() => {
    return !showMore && searchFilteredItems.length > MIN_ITEMS_FOR_SEARCH;
  }, [showMore, searchFilteredItems]);

  return (
    <AccordionItem value={filterKey}>
      <div className="flex items-center justify-between px-6">
        <AccordionTrigger className="h-[48px] text-nowrap">{name}</AccordionTrigger>
        <FilterClearButton filterKeys={[filterKey]} className="text-foreground-subtle body-xs">
          Clear
        </FilterClearButton>
      </div>
      <AccordionContent className="flex flex-col gap-2 overflow-visible px-6 pb-2 pt-1">
        {items.length > MIN_ITEMS_FOR_SEARCH && (
          <Input
            placeholder={`Search ${name.toLowerCase()}`}
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
            className="h-[28px]"
          />
        )}
        <div className="scrollbar-thin scrollbar-thumb-euler-600 scrollbar-track-transparent scrollbar-thumb-rounded-full flex flex-col overflow-y-auto">
          {searchFilteredItems.length > 0 ? (
            searchFilteredItems.slice(0, isHidingItems ? MIN_ITEMS_FOR_SEARCH : undefined).map((item, i) => {
              const checked = filterValues.includes(item.value);
              return (
                <TableFilterItem
                  key={i}
                  checked={checked}
                  {...item}
                  onClick={() => handleFilterChange(item.value, !checked)}
                />
              );
            })
          ) : (
            <div className="text-content-secondary body-sm flex w-full flex-col items-center justify-center gap-1 text-center">
              <span className="text-foreground-subtle font-medium">No results found.</span>
            </div>
          )}
        </div>
        {isHidingItems && (
          <button onClick={() => setShowMore(true)} className="text-foreground-subtle body-sm ml-2 w-fit">
            Show more ({searchFilteredItems.length - MIN_ITEMS_FOR_SEARCH})
          </button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
