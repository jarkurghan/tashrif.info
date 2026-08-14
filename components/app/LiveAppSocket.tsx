"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useActiveApp } from "@/components/app/ActiveAppProvider";
import { getWsUrl } from "@/lib/api";

export type LivePageview = {
  id: string;
  time: string;
  method: string | null;
  path: string;
  country: string | null;
  ip: string | null;
  visitorId: string;
  userAgent: string | null;
};

export type LiveEventType = "pageview" | "access" | "telegram" | "inbox";

export type LiveEvent =
  | { type: "pageview"; appId: string; item: LivePageview }
  | { type: "access"; appId: string }
  | { type: "telegram"; appId: string }
  | { type: "inbox" };

type Listener = (event: LiveEvent) => void;

type LiveAppSocketValue = {
  subscribe: (fn: Listener) => () => void;
};

const LiveAppSocketContext = createContext<LiveAppSocketValue | null>(null);

export function LiveAppSocketProvider({ children }: { children: ReactNode }) {
  const { data } = useSession();
  const { activeAppId } = useActiveApp();
  const listeners = useRef(new Set<Listener>());
  const appIdRef = useRef(activeAppId);
  const wsRef = useRef<WebSocket | null>(null);
  const authedRef = useRef(false);

  appIdRef.current = activeAppId;

  const subscribe = useCallback((fn: Listener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  const emit = useCallback((event: LiveEvent) => {
    for (const fn of listeners.current) fn(event);
  }, []);

  useEffect(() => {
    const token = data?.apiToken;
    if (!token) return;

    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const sendSubscribe = (socket: WebSocket) => {
      const appId = appIdRef.current;
      if (!authedRef.current || socket.readyState !== WebSocket.OPEN || !appId) return;
      socket.send(JSON.stringify({ type: "subscribe", appId }));
    };

    const connect = () => {
      if (closed) return;
      const socket = new WebSocket(getWsUrl());
      wsRef.current = socket;
      authedRef.current = false;

      socket.addEventListener("open", () => {
        socket.send(JSON.stringify({ type: "auth.user", token }));
      });

      socket.addEventListener("message", (ev) => {
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (msg.type === "auth.ok") {
          authedRef.current = true;
          sendSubscribe(socket);
          return;
        }
        if (msg.type === "inbox") {
          emit({ type: "inbox" });
          return;
        }
        if (msg.appId !== appIdRef.current) return;
        if (msg.type === "pageview" && msg.item) {
          emit({
            type: "pageview",
            appId: String(msg.appId),
            item: msg.item as LivePageview,
          });
          return;
        }
        if (msg.type === "access" || msg.type === "telegram") {
          emit({ type: msg.type, appId: String(msg.appId) });
        }
      });

      socket.addEventListener("close", () => {
        authedRef.current = false;
        if (wsRef.current === socket) wsRef.current = null;
        if (closed) return;
        reconnectTimer = setTimeout(connect, 3000);
      });

      socket.addEventListener("error", () => {
        socket.close();
      });
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      authedRef.current = false;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [data?.apiToken, emit]);

  useEffect(() => {
    const socket = wsRef.current;
    if (!socket || !activeAppId) return;
    if (!authedRef.current || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "subscribe", appId: activeAppId }));
  }, [activeAppId]);

  return (
    <LiveAppSocketContext.Provider value={{ subscribe }}>
      {children}
    </LiveAppSocketContext.Provider>
  );
}

export function useLiveEvents(
  types: LiveEventType | LiveEventType[],
  onEvent: (event: LiveEvent) => void,
) {
  const ctx = useContext(LiveAppSocketContext);
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;
  const want = Array.isArray(types) ? types : [types];

  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribe((event) => {
      if (!want.includes(event.type)) return;
      cbRef.current(event);
    });
  }, [ctx, want.join(",")]);
}

export function useLivePageviews(onPageview: (item: LivePageview) => void) {
  useLiveEvents("pageview", (event) => {
    if (event.type === "pageview") onPageview(event.item);
  });
}

export function useLiveRefetch(
  reload: () => void,
  delayMs = 400,
  type: LiveEventType = "pageview",
) {
  const reloadRef = useRef(reload);
  reloadRef.current = reload;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useLiveEvents(type, () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      reloadRef.current();
    }, delayMs);
  });
}
