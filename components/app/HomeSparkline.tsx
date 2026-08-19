"use client";

import { useEffect, useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function HomeSparkline({
  data,
  color = "var(--chart-1)",
}: {
  data: { v: number }[];
  color?: string;
}) {
  const [ready, setReady] = useState(false);
  const gid = useId().replace(/:/g, "");
  useEffect(() => setReady(true), []);

  if (data.length < 2) return null;

  return (
    <div className="h-12 w-full">
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`sp-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              fill={`url(#sp-${gid})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
