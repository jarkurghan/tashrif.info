"use client";

import { useEffect, useRef, useState } from "react";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://localapi.sanoq.uz/ws";

export function useLiveVisitors(appId: string | undefined, apiToken?: string) {
  const [count, setCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!appId || !apiToken) return;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "auth.ui", token: apiToken }));
    });

    ws.addEventListener("message", (ev) => {
      try {
        const data = JSON.parse(String(ev.data));
        if (data.type === "auth.ok") {
          ws.send(JSON.stringify({ type: "subscribe", appId }));
        }
        if (
          (data.type === "live.visitors" || data.type === "live.hit") &&
          data.appId === appId
        ) {
          setCount(Number(data.count ?? data.live ?? 0));
        }
      } catch {
        /* ignore */
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [appId, apiToken]);

  return count;
}
