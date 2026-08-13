import { env } from "@/lib/env";
import { PrintTrafficView } from "./PrintTrafficView";

export const dynamic = "force-dynamic";

type TrafficBundle = {
  appId: string;
  overview: {
    users: number;
    pageviews: number;
    newUsers: number;
    lastVisit: string | null;
  };
  series: { date: string; sessions: number; pageviews: number }[];
  pages: { label: string; value: number; percent: number }[];
  locations: {
    label: string;
    value: number;
    percent: number;
    code?: string;
  }[];
  referrers: { label: string; value: number; percent: number }[];
  userAgents: { label: string; value: number }[];
};

export default async function PrintTrafficPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; appId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { appId } = await params;
  const { token } = await searchParams;
  if (!token) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Missing token</p>
    );
  }

  const url = `${env.apiUrl.replace(/\/$/, "")}/v1/print/traffic?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Unauthorized</p>
    );
  }

  const data = (await res.json()) as TrafficBundle;
  if (data.appId !== appId) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Unauthorized</p>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <PrintTrafficView
        overview={data.overview}
        series={data.series}
        pages={data.pages}
        locations={data.locations}
        referrers={data.referrers}
        uaRaw={data.userAgents}
      />
    </div>
  );
}
