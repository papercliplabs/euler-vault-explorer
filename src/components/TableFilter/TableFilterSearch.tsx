"use client";
import { useShallowSearchParams } from "@/hooks/useShallowSearchParams";
import { Input } from "../ui/input";
import { FILTER_KEY_SEARCH } from "./filterKeys";

export default function TableFilterSearch() {
  const {
    values: [searchVals],
    addShallowSearchParams,
  } = useShallowSearchParams({ keys: [FILTER_KEY_SEARCH] });
  const searchVal = searchVals[0] ?? "";

  return (
    <Input
      placeholder="Search vault name, symbol or address"
      className="w-auto grow"
      value={searchVal}
      onChange={(e) => addShallowSearchParams([{ key: FILTER_KEY_SEARCH, value: e.target.value }])}
    />
  );
}
