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
    removeShallowSearchParams,
  } = useShallowSearchParams({ keys: [FILTER_KEY_SEARCH] });

  const [searchValLocal, setSearchValLocal] = useState<string>(searchVals[0] ?? "");
  const [debouncedValue] = useDebounceValue(searchValLocal, 300);

  useEffect(() => {
    if (debouncedValue == "") {
      removeShallowSearchParams([FILTER_KEY_SEARCH]);
    } else {
      addShallowSearchParams([{ key: FILTER_KEY_SEARCH, value: debouncedValue }]);
    }
  }, [debouncedValue, addShallowSearchParams]);

  return (
    <Input
      placeholder="Search vault name, symbol or address"
      className="w-auto grow"
      value={searchValLocal}
      onChange={(e) => setSearchValLocal(e.target.value)}
    />
  );
}
