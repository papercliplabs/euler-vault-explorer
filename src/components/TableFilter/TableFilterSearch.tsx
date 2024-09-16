"use client";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { Input } from "../ui/input";
import { FILTER_KEY_SEARCH } from "./filterKeys";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function TableFilterSearch() {
  const {
    values: [searchVals],
    addShallowSearchParams,
  } = useShallowSearchParams({ keys: [FILTER_KEY_SEARCH] });

  const [searchValLocal, setSearchValLocal] = useState<string>(searchVals[0] ?? "");
  const [debouncedValue] = useDebounceValue(searchValLocal, 300);

  useEffect(() => {
    addShallowSearchParams([{ key: FILTER_KEY_SEARCH, value: debouncedValue }]);
  }, [debouncedValue]);

  return (
    <Input
      placeholder="Search vault name, symbol or address"
      className="w-auto grow"
      value={searchValLocal}
      onChange={(e) => setSearchValLocal(e.target.value)}
    />
  );
}
