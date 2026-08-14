"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_RANGE,
  RANGE_STORAGE_KEY,
  isRangeKey,
  rangeBounds,
  rangeSearchParams,
  type RangeKey,
} from "@/lib/date-range";

type DateRangeContextValue = {
  range: RangeKey;
  setRange: (key: RangeKey) => void;
  from: Date;
  to: Date;
  searchParams: URLSearchParams;
  queryString: string;
  ready: boolean;
};

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRangeState] = useState<RangeKey>(DEFAULT_RANGE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RANGE_STORAGE_KEY);
      if (isRangeKey(stored)) setRangeState(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setRange = useCallback((key: RangeKey) => {
    setRangeState(key);
    try {
      localStorage.setItem(RANGE_STORAGE_KEY, key);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => {
    const { from, to } = rangeBounds(range);
    const searchParams = rangeSearchParams(range);
    return {
      range: ready ? range : DEFAULT_RANGE,
      setRange,
      from,
      to,
      searchParams,
      queryString: searchParams.toString(),
      ready,
    };
  }, [range, ready, setRange]);

  return (
    <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) {
    throw new Error("useDateRange must be used within DateRangeProvider");
  }
  return ctx;
}
