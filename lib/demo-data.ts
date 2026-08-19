import type { RangeKey } from "./date-range";

export type SeriesPoint = {
  date: string;
  sessions: number;
  pageviews: number;
};

export type RankedItem = {
  label: string;
  value: number;
  percent: number;
  flag?: string;
  code?: string;
  title?: string;
};

export type PageRow = {
  path: string;
  visits: number;
  visitors: number;
  sessions: number;
  countries: number;
  percent: number;
};

export type LogEntry = {
  id: string;
  time: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  country: string;
  ip: string;
  visitorId: string;
  userAgent: string;
};

export type DomainRow = {
  domain: string;
  clientId: string;
  role: "owner" | "admin" | "viewer";
};

export type AccessRow = {
  email: string;
  role: "owner" | "admin" | "viewer";
  status: "accepted" | "pending";
  invitedAt: string;
};

export type ReportKind = "stats" | "log" | "traffic";
export type ReportSchedule = "daily" | "weekly" | "monthly";

export type ReportItem = {
  id: string;
  schedule: ReportSchedule;
  kind: ReportKind;
};

export type ReportChat = {
  id: string;
  name: string;
  chatId: string;
  reports: ReportItem[];
};

const CHROME_WIN =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const SAFARI_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const CHROME_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.135 Mobile Safari/537.36";
const FIREFOX_LINUX =
  "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0";

export const demoOverview = {
  users: 8420,
  pageviews: 19680,
  newUsers: 2140,
  sessions: 9120,
  bounceRate: 0.42,
  lastVisit: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  previous: {
    users: 7180,
    pageviews: 16240,
    newUsers: 1680,
    sessions: 7800,
    bounceRate: 0.48,
  },
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

const HOURLY_SESSIONS = [
  52, 41, 38, 36, 44, 78, 210, 420, 580, 640, 610, 720, 780, 740, 690, 810, 960,
  1120, 1280, 1180, 920, 640, 310, 120,
];

export const demoHourly = HOURLY_SESSIONS.map((sessions, hour) => ({
  hour,
  pageviews: Math.round(sessions * 2.15),
}));

function point(date: string, sessions: number): SeriesPoint {
  return {
    date,
    sessions,
    pageviews: Math.round(sessions * 2.15),
  };
}

const WEEKDAY_FACTOR = [0.62, 1, 1.06, 1.1, 1.08, 0.92, 0.55];

const TARGET_POINTS = 24;

function downsampleSeries(points: SeriesPoint[]): SeriesPoint[] {
  if (points.length <= TARGET_POINTS + 2) return points;
  const step = Math.ceil(points.length / TARGET_POINTS);
  const out: SeriesPoint[] = [];
  for (let i = 0; i < points.length; i += step) {
    const chunk = points.slice(i, i + step);
    const sessions = chunk.reduce((s, p) => s + p.sessions, 0);
    const pageviews = chunk.reduce((s, p) => s + p.pageviews, 0);
    out.push({ date: chunk[0].date, sessions, pageviews });
  }
  return out;
}

export function demoSeriesForRange(key: RangeKey, now = new Date()): SeriesPoint[] {
  if (key === "24h") {
    return downsampleSeries(
      Array.from({ length: 24 }, (_, i) => {
        const d = new Date(now);
        d.setUTCMinutes(0, 0, 0);
        d.setUTCHours(d.getUTCHours() - 23 + i);
        const hour = d.getUTCHours();
        const sessions = HOURLY_SESSIONS[hour] ?? 100;
        return point(
          `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(hour)}:00`,
          sessions,
        );
      }),
    );
  }

  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  return downsampleSeries(
    Array.from({ length: days }, (_, i) => {
      const d = new Date(now);
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - (days - 1 - i));
      const base = 4200 + ((i * 173) % 2200);
      const sessions = Math.round(base * WEEKDAY_FACTOR[d.getUTCDay()]!);
      return point(
        `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`,
        sessions,
      );
    }),
  );
}

export const countries: RankedItem[] = [
  { label: "UZ", value: 4820, percent: 38, code: "UZ" },
  { label: "KZ", value: 1240, percent: 10, code: "KZ" },
  { label: "RU", value: 980, percent: 8, code: "RU" },
  { label: "TR", value: 860, percent: 7, code: "TR" },
  { label: "US", value: 720, percent: 6, code: "US" },
  { label: "DE", value: 540, percent: 4, code: "DE" },
  { label: "KR", value: 410, percent: 3, code: "KR" },
  { label: "AE", value: 280, percent: 2, code: "AE" },
];

export const pages: RankedItem[] = [
  { label: "/", value: 6120, percent: 31 },
  { label: "/mahsulotlar", value: 2940, percent: 15 },
  { label: "/yangiliklar", value: 2180, percent: 11 },
  { label: "/savat", value: 1760, percent: 9 },
  { label: "/aloqa", value: 1180, percent: 6 },
  { label: "/kirish", value: 980, percent: 5 },
  { label: "/tolov", value: 740, percent: 4 },
];

export const pageRows: PageRow[] = [
  { path: "/", visits: 6120, visitors: 2840, sessions: 3120, countries: 18, percent: 31 },
  { path: "/mahsulotlar", visits: 2940, visitors: 1680, sessions: 1910, countries: 12, percent: 15 },
  { path: "/yangiliklar", visits: 2180, visitors: 1420, sessions: 1510, countries: 9, percent: 11 },
  { path: "/savat", visits: 1760, visitors: 890, sessions: 940, countries: 7, percent: 9 },
  { path: "/aloqa", visits: 1180, visitors: 760, sessions: 810, countries: 6, percent: 6 },
  { path: "/kirish", visits: 980, visitors: 720, sessions: 740, countries: 8, percent: 5 },
  { path: "/tolov", visits: 740, visitors: 410, sessions: 430, countries: 5, percent: 4 },
  { path: "/blog/yetkazib-berish", visits: 520, visitors: 380, sessions: 390, countries: 4, percent: 3 },
];

export const referrers: RankedItem[] = [
  { label: "(direct)", value: 5200, percent: 36 },
  { label: "google.com", value: 3400, percent: 24 },
  { label: "t.me", value: 1800, percent: 13 },
  { label: "instagram.com", value: 980, percent: 7 },
  { label: "yandex.ru", value: 720, percent: 5 },
  { label: "facebook.com", value: 410, percent: 3 },
];

export const userAgents: RankedItem[] = [
  { label: CHROME_WIN, value: 4200, percent: 38 },
  { label: SAFARI_IOS, value: 2480, percent: 22 },
  { label: CHROME_ANDROID, value: 1640, percent: 15 },
  { label: CHROME_MAC, value: 1280, percent: 12 },
  { label: FIREFOX_LINUX, value: 620, percent: 6 },
];

export const landingSparkline = [
  { t: "Mon", v: 620 },
  { t: "Tue", v: 710 },
  { t: "Wed", v: 680 },
  { t: "Thu", v: 840 },
  { t: "Fri", v: 960 },
  { t: "Sat", v: 780 },
  { t: "Sun", v: 890 },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function makeLogs(): LogEntry[] {
  const paths = [
    "/",
    "/mahsulotlar",
    "/yangiliklar",
    "/savat",
    "/aloqa",
    "/kirish",
    "/tolov",
  ];
  const countryCodes = ["UZ", "UZ", "KZ", "RU", "TR", "UZ", "DE", "US"];
  const methods: LogEntry["method"][] = ["GET", "GET", "GET", "POST", "GET"];
  const agents = [CHROME_WIN, SAFARI_IOS, CHROME_ANDROID, CHROME_MAC, FIREFOX_LINUX];
  const ipBases = [
    [213, 230],
    [195, 158],
    [84, 54],
    [185, 8],
  ];

  return Array.from({ length: 64 }, (_, i) => {
    const hour = (21 - Math.floor(i / 3) + 24) % 24;
    const min = (i * 11) % 60;
    const sec = (i * 17) % 60;
    const [a, b] = ipBases[i % ipBases.length];
    return {
      id: `log_${pad(i + 1)}`,
      time: `2026-08-12T${pad(hour)}:${pad(min)}:${pad(sec)}+05:00`,
      method: methods[i % methods.length],
      path: paths[i % paths.length],
      country: countryCodes[i % countryCodes.length],
      ip: `${a}.${b}.${(i * 3) % 220}.${(i * 13) % 250}`,
      visitorId: `vis_${(2400 + ((i * 41) % 7000)).toString(16)}`,
      userAgent: agents[i % agents.length],
    };
  });
}

export const logs = makeLogs();

export const domains: DomainRow[] = [
  { domain: "bozor.uz", clientId: "app_8f2a1c", role: "owner" },
  { domain: "maktab.uz", clientId: "app_3b91e0", role: "admin" },
  { domain: "shop.bozor.uz", clientId: "app_c4d771", role: "viewer" },
];

export const accessRows: AccessRow[] = [
  {
    email: "siz@tashrif.info",
    role: "owner",
    status: "accepted",
    invitedAt: "2025-11-02",
  },
  {
    email: "dilshod@bozor.uz",
    role: "admin",
    status: "accepted",
    invitedAt: "2026-01-18",
  },
  {
    email: "madina@bozor.uz",
    role: "viewer",
    status: "accepted",
    invitedAt: "2026-02-04",
  },
  {
    email: "tahlil@hamkor.uz",
    role: "viewer",
    status: "pending",
    invitedAt: "2026-08-10",
  },
];

export const reportChats: ReportChat[] = [
  {
    id: "chat_1",
    name: "Bozor statistikasi",
    chatId: "-1002145987632",
    reports: [
      { id: "r1", schedule: "daily", kind: "stats" },
      { id: "r2", schedule: "daily", kind: "traffic" },
      { id: "r3", schedule: "weekly", kind: "log" },
    ],
  },
  {
    id: "chat_2",
    name: "Jamoa kanali",
    chatId: "-1001987654321",
    reports: [{ id: "r4", schedule: "weekly", kind: "stats" }],
  },
];

export function formatCount(n: number) {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}k`;
  }
  return String(n);
}
