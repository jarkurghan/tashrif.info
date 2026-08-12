export type Metric = {
  key: "users" | "sessions" | "pageviews" | "bounce" | "duration";
  value: string;
  trend: string;
  positive?: boolean;
};

export type SeriesPoint = {
  date: string;
  sessions: number;
  durationMin: number;
};

export type RankedItem = {
  label: string;
  value: number;
  percent: number;
  flag?: string;
  code?: string;
};

export type EventPoint = {
  time: string;
  "login-button-header": number;
  "get-started-button": number;
  "community-GitHub": number;
  "pricing-cta": number;
  "docs-search": number;
};

export type LogEntry = {
  id: string;
  time: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  status: number;
  country: string;
  flag: string;
  ip: string;
  visitorId: string;
};

export type DomainRow = {
  domain: string;
  appId: string;
  status: "active" | "pending";
  role: "owner" | "admin" | "viewer";
  visitors: string;
};

export type AccessRow = {
  email: string;
  role: "owner" | "admin" | "viewer";
  status: "accepted" | "pending";
  invitedAt: string;
};

export type ReportChat = {
  name: string;
  chatId: string;
  schedule: "daily" | "weekly" | "monthly";
};

export const metrics: Metric[] = [
  { key: "users", value: "10.6k", trend: "+1.2k" },
  { key: "sessions", value: "11.4k", trend: "+890" },
  { key: "pageviews", value: "26.8k", trend: "+3.4k" },
  { key: "bounce", value: "42.4%", trend: "-2.1%", positive: true },
  { key: "duration", value: "4m 27s", trend: "+38s" },
];

export const trafficSeries: SeriesPoint[] = [
  { date: "27 Dec", sessions: 420, durationMin: 3.2 },
  { date: "03 Jan", sessions: 510, durationMin: 3.8 },
  { date: "10 Jan", sessions: 480, durationMin: 4.1 },
  { date: "17 Jan", sessions: 640, durationMin: 3.6 },
  { date: "24 Jan", sessions: 720, durationMin: 4.5 },
  { date: "31 Jan", sessions: 690, durationMin: 5.1 },
  { date: "07 Feb", sessions: 810, durationMin: 4.8 },
  { date: "14 Feb", sessions: 760, durationMin: 5.4 },
  { date: "21 Feb", sessions: 920, durationMin: 4.9 },
  { date: "28 Feb", sessions: 880, durationMin: 5.8 },
  { date: "07 Mar", sessions: 970, durationMin: 5.2 },
  { date: "14 Mar", sessions: 1040, durationMin: 6.1 },
];

export const countries: RankedItem[] = [
  { label: "United States", value: 3400, percent: 32, flag: "🇺🇸", code: "US" },
  { label: "Uzbekistan", value: 1820, percent: 17, flag: "🇺🇿", code: "UZ" },
  { label: "Germany", value: 794, percent: 7, flag: "🇩🇪", code: "DE" },
  { label: "United Kingdom", value: 776, percent: 7, flag: "🇬🇧", code: "GB" },
  { label: "Russia", value: 612, percent: 6, flag: "🇷🇺", code: "RU" },
  { label: "Turkey", value: 540, percent: 5, flag: "🇹🇷", code: "TR" },
  { label: "France", value: 420, percent: 4, flag: "🇫🇷", code: "FR" },
  { label: "Kazakhstan", value: 380, percent: 4, flag: "🇰🇿", code: "KZ" },
];

export const regions: RankedItem[] = [
  { label: "California", value: 980, percent: 9 },
  { label: "Tashkent", value: 1120, percent: 10 },
  { label: "Bavaria", value: 310, percent: 3 },
  { label: "England", value: 420, percent: 4 },
  { label: "Moscow", value: 290, percent: 3 },
];

export const cities: RankedItem[] = [
  { label: "Tashkent", value: 980, percent: 9 },
  { label: "New York", value: 720, percent: 7 },
  { label: "London", value: 510, percent: 5 },
  { label: "Berlin", value: 340, percent: 3 },
  { label: "Istanbul", value: 290, percent: 3 },
];

export const pages: RankedItem[] = [
  { label: "/", value: 6700, percent: 25 },
  { label: "/pricing", value: 4200, percent: 16 },
  { label: "/docs", value: 3100, percent: 12 },
  { label: "/features", value: 2400, percent: 9 },
  { label: "/blog", value: 1800, percent: 7 },
  { label: "/dashboard", value: 1500, percent: 6 },
  { label: "/login", value: 980, percent: 4 },
];

export const entryPages: RankedItem[] = [
  { label: "/", value: 5200, percent: 41 },
  { label: "/pricing", value: 2100, percent: 17 },
  { label: "/blog/analytics-101", value: 890, percent: 7 },
  { label: "/features", value: 720, percent: 6 },
];

export const exitPages: RankedItem[] = [
  { label: "/pricing", value: 1800, percent: 19 },
  { label: "/", value: 1400, percent: 15 },
  { label: "/docs/sdk", value: 920, percent: 10 },
  { label: "/login", value: 610, percent: 6 },
];

export const eventSeries: EventPoint[] = [
  {
    time: "11:00 AM",
    "login-button-header": 18,
    "get-started-button": 32,
    "community-GitHub": 12,
    "pricing-cta": 22,
    "docs-search": 8,
  },
  {
    time: "2:00 PM",
    "login-button-header": 28,
    "get-started-button": 44,
    "community-GitHub": 18,
    "pricing-cta": 30,
    "docs-search": 14,
  },
  {
    time: "5:00 PM",
    "login-button-header": 36,
    "get-started-button": 52,
    "community-GitHub": 24,
    "pricing-cta": 41,
    "docs-search": 19,
  },
  {
    time: "8:00 PM",
    "login-button-header": 22,
    "get-started-button": 38,
    "community-GitHub": 16,
    "pricing-cta": 27,
    "docs-search": 11,
  },
  {
    time: "11:00 PM",
    "login-button-header": 14,
    "get-started-button": 21,
    "community-GitHub": 9,
    "pricing-cta": 15,
    "docs-search": 6,
  },
  {
    time: "2:00 AM",
    "login-button-header": 8,
    "get-started-button": 12,
    "community-GitHub": 4,
    "pricing-cta": 7,
    "docs-search": 3,
  },
  {
    time: "5:00 AM",
    "login-button-header": 6,
    "get-started-button": 9,
    "community-GitHub": 3,
    "pricing-cta": 5,
    "docs-search": 2,
  },
  {
    time: "8:00 AM",
    "login-button-header": 20,
    "get-started-button": 35,
    "community-GitHub": 14,
    "pricing-cta": 24,
    "docs-search": 10,
  },
];

export const eventKeys = [
  "login-button-header",
  "get-started-button",
  "community-GitHub",
  "pricing-cta",
  "docs-search",
] as const;

export const eventColors: Record<(typeof eventKeys)[number], string> = {
  "login-button-header": "var(--chart-1)",
  "get-started-button": "var(--chart-2)",
  "community-GitHub": "var(--chart-3)",
  "pricing-cta": "var(--chart-4)",
  "docs-search": "var(--chart-5)",
};

export const landingSparkline = [
  { t: "Mon", v: 420 },
  { t: "Tue", v: 510 },
  { t: "Wed", v: 480 },
  { t: "Thu", v: 640 },
  { t: "Fri", v: 720 },
  { t: "Sat", v: 580 },
  { t: "Sun", v: 690 },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function makeLogs(): LogEntry[] {
  const paths = ["/", "/pricing", "/docs", "/features", "/blog", "/login", "/api/track"];
  const countries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "Uzbekistan", flag: "🇺🇿" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Turkey", flag: "🇹🇷" },
  ];
  const methods: LogEntry["method"][] = ["GET", "GET", "GET", "POST", "PUT"];
  const statuses = [200, 200, 200, 201, 304, 404];

  return Array.from({ length: 87 }, (_, i) => {
    const c = countries[i % countries.length];
    const hour = (23 - Math.floor(i / 4)) % 24;
    const min = (i * 7) % 60;
    return {
      id: `log_${pad(i + 1)}`,
      time: `2026-03-14 ${pad(hour)}:${pad(min)}`,
      method: methods[i % methods.length],
      path: paths[i % paths.length],
      status: statuses[i % statuses.length],
      country: c.name,
      flag: c.flag,
      ip: `185.${(i * 3) % 255}.${(i * 11) % 255}.${(i * 17) % 255}`,
      visitorId: `vis_${(1000 + ((i * 37) % 9000)).toString(16)}`,
    };
  });
}

export const logs = makeLogs();

export const domains: DomainRow[] = [
  {
    domain: "acme.uz",
    appId: "app_8f2a1c",
    status: "active",
    role: "owner",
    visitors: "12.4k",
  },
  {
    domain: "shop.tashrif.dev",
    appId: "app_3b91e0",
    status: "active",
    role: "admin",
    visitors: "3.1k",
  },
  {
    domain: "staging.acme.uz",
    appId: "app_c4d771",
    status: "pending",
    role: "owner",
    visitors: "—",
  },
];

export const accessRows: AccessRow[] = [
  {
    email: "you@tashrif.info",
    role: "owner",
    status: "accepted",
    invitedAt: "2025-11-02",
  },
  {
    email: "dilshod@acme.uz",
    role: "admin",
    status: "accepted",
    invitedAt: "2026-01-18",
  },
  {
    email: "madina@acme.uz",
    role: "viewer",
    status: "accepted",
    invitedAt: "2026-02-04",
  },
  {
    email: "analyst@partner.uz",
    role: "viewer",
    status: "pending",
    invitedAt: "2026-03-10",
  },
];

export const reportChats: ReportChat[] = [
  {
    name: "Acme Analytics",
    chatId: "-1002145987632",
    schedule: "daily",
  },
  {
    name: "Product Weekly",
    chatId: "-1001987654321",
    schedule: "weekly",
  },
];

export function formatCount(n: number) {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}k`;
  }
  return String(n);
}
