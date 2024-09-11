"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseShallowSearchParamParams {
  name: string;
}

interface UseShallowSearchParamReturnType {
  value: string | null;
  addShallowSearchParam: (name: string, value: string) => void;
  removeShallowSearchParam: (name: string) => void;
}

export function useShallowSearchParam({ name }: UseShallowSearchParamParams): UseShallowSearchParamReturnType {
  const searchParams = useSearchParams();
  const value = useMemo(() => searchParams.get(name), [searchParams, name]);

  const addShallowSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      window.history.pushState(null, "", `?${params.toString()}`);
    },
    [searchParams]
  );

  const removeShallowSearchParam = useCallback(
    (name: string) => {
      const curr = searchParams.get(name);
      if (curr) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(name);
        window.history.pushState(null, "", `?${params.toString()}`);
      }
    },
    [searchParams]
  );

  return { value, addShallowSearchParam, removeShallowSearchParam };
}
