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
import { useLiveRefetch } from "@/components/app/LiveAppSocket";

type DateRangeContextValue = {
  range: RangeKey;
  setRange: (key: RangeKey) => void;
  from: Date;
  to: Date;
  searchParams: URLSearchParams;
  queryString: string;
  freshQueryString: () => string;
  ready: boolean;
};

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRangeState] = useState<RangeKey>(DEFAULT_RANGE);
  const [ready, setReady] = useState(false);
  const [clock, setClock] = useState(() => Date.now());

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

  const freshQueryString = useCallback(() => rangeSearchParams(range).toString(), [range]);

  useLiveRefetch(() => setClock(Date.now()), 400);

  const value = useMemo(() => {
    const now = new Date(clock);
    const { from, to } = rangeBounds(range, now);
    const searchParams = rangeSearchParams(range, now);
    return {
      range: ready ? range : DEFAULT_RANGE,
      setRange,
      from,
      to,
      searchParams,
      queryString: searchParams.toString(),
      freshQueryString,
      ready,
    };
  }, [range, ready, setRange, clock, freshQueryString]);

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
