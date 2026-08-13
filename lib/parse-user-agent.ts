export type ParsedUserAgent = {
  browser: string;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
};

function majorMinor(raw: string): string {
  const parts = raw.split(/[._]/).filter(Boolean);
  if (parts.length === 0) return raw;
  if (parts.length === 1) return parts[0]!;
  if (parts[1] === "0" && parts.length <= 4) return parts[0]!;
  return `${parts[0]}.${parts[1]}`;
}

function match(ua: string, re: RegExp): string | null {
  const m = ua.match(re);
  return m?.[1] ?? null;
}

function detectOs(ua: string): { os: string; osVersion: string | null } | null {
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const v =
      match(ua, /(?:iPhone|CPU) OS (\d+[._]\d+)/i) ??
      match(ua, /OS (\d+[._]\d+)/i);
    return { os: /iPad/i.test(ua) ? "iPadOS" : "iOS", osVersion: v ? majorMinor(v) : null };
  }
  if (/Android/i.test(ua)) {
    const v = match(ua, /Android (\d+(?:\.\d+)?)/i);
    return { os: "Android", osVersion: v };
  }
  if (/Windows Phone/i.test(ua)) {
    return { os: "Windows Phone", osVersion: match(ua, /Windows Phone (?:OS )?(\d+\.\d+)/i) };
  }
  if (/Windows NT 10\.0/i.test(ua)) return { os: "Windows", osVersion: "10+" };
  if (/Windows NT 6\.3/i.test(ua)) return { os: "Windows", osVersion: "8.1" };
  if (/Windows NT 6\.2/i.test(ua)) return { os: "Windows", osVersion: "8" };
  if (/Windows NT 6\.1/i.test(ua)) return { os: "Windows", osVersion: "7" };
  if (/Windows NT 6\.0/i.test(ua)) return { os: "Windows", osVersion: "Vista" };
  if (/Windows NT 5\.1|Windows XP/i.test(ua)) return { os: "Windows", osVersion: "XP" };
  if (/Windows/i.test(ua)) return { os: "Windows", osVersion: null };
  if (/CrOS/i.test(ua)) {
    return { os: "Chrome OS", osVersion: match(ua, /CrOS \S+ (\d+\.\d+)/i) };
  }
  if (/Macintosh|Mac OS X/i.test(ua)) {
    const v = match(ua, /Mac OS X (\d+[._]\d+)/i);
    return { os: "macOS", osVersion: v ? majorMinor(v) : null };
  }
  if (/Linux/i.test(ua)) return { os: "Linux", osVersion: null };
  return null;
}

/** More specific engines/apps first so Chrome/Safari tokens do not win. */
const BROWSER_RULES: Array<{
  name: string;
  test: RegExp;
  version: RegExp[];
}> = [
  { name: "Googlebot", test: /Googlebot/i, version: [/Googlebot\/(\d+(?:\.\d+)?)/i] },
  { name: "Bingbot", test: /bingbot/i, version: [/bingbot\/(\d+(?:\.\d+)?)/i] },
  { name: "YandexBot", test: /YandexBot/i, version: [/YandexBot\/(\d+(?:\.\d+)?)/i] },
  { name: "GPTBot", test: /GPTBot/i, version: [/GPTBot\/(\d+(?:\.\d+)?)/i] },
  { name: "AhrefsBot", test: /AhrefsBot/i, version: [/AhrefsBot\/(\d+(?:\.\d+)?)/i] },
  { name: "SemrushBot", test: /SemrushBot/i, version: [/SemrushBot\/(\d+(?:\.\d+)?)/i] },
  { name: "curl", test: /\bcurl\//i, version: [/curl\/(\S+)/i] },
  { name: "wget", test: /\bwget\//i, version: [/wget\/(\S+)/i] },
  { name: "httpie", test: /\bHTTPie\//i, version: [/HTTPie\/(\S+)/i] },
  { name: "Python Requests", test: /python-requests/i, version: [/python-requests\/(\S+)/i] },
  { name: "Go HTTP", test: /Go-http-client/i, version: [/Go-http-client\/(\S+)/i] },
  { name: "okhttp", test: /okhttp/i, version: [/okhttp\/(\S+)/i] },
  { name: "Dart", test: /\bDart\//i, version: [/Dart\/(\S+)/i] },

  { name: "Instagram", test: /Instagram/i, version: [/Instagram[ /](\d+(?:\.\d+)?)/i] },
  { name: "Facebook", test: /FBAN|FBAV|FB_IAB/i, version: [/FBAV\/(\d+(?:\.\d+)?)/i] },
  { name: "WhatsApp", test: /WhatsApp/i, version: [/WhatsApp\/(\d+(?:\.\d+)?)/i] },
  { name: "Telegram", test: /Telegram/i, version: [/Telegram(?:Bot)?[ /](\d+(?:\.\d+)?)/i] },
  { name: "TikTok", test: /BytedanceWebview|TikTok|musical_ly/i, version: [/app_version\/(\d+(?:\.\d+)?)/i] },
  { name: "Snapchat", test: /Snapchat/i, version: [/Snapchat\/(\d+(?:\.\d+)?)/i] },
  { name: "LINE", test: /\bLine\//i, version: [/Line\/(\d+(?:\.\d+)?)/i] },
  { name: "WeChat", test: /MicroMessenger/i, version: [/MicroMessenger\/(\d+(?:\.\d+)?)/i] },
  { name: "Twitter", test: /Twitter/i, version: [/Twitter(?:Android|iPhone)?\/(\d+(?:\.\d+)?)/i] },

  { name: "Cursor", test: /\bCursor\//i, version: [/Cursor\/(\d+(?:\.\d+)?)/i] },
  { name: "VS Code", test: /VSCode|Visual Studio Code/i, version: [/Electron\/(\d+(?:\.\d+)?)/i] },
  { name: "Discord", test: /Discord\//i, version: [/Discord\/(\d+(?:\.\d+)?)/i] },
  { name: "Slack", test: /Slack\//i, version: [/Slack_SSB\/(\d+(?:\.\d+)?)/i, /Slack\/(\d+(?:\.\d+)?)/i] },
  { name: "Electron", test: /Electron\//i, version: [/Electron\/(\d+(?:\.\d+)?)/i] },

  { name: "Yandex", test: /YaBrowser/i, version: [/YaBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "Samsung Internet", test: /SamsungBrowser/i, version: [/SamsungBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "UC Browser", test: /UCBrowser/i, version: [/UCBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "Opera", test: /\bOPR\/|\bOpera\//i, version: [/OPR\/(\d+(?:\.\d+)?)/i, /Opera\/(\d+(?:\.\d+)?)/i] },
  { name: "Opera Mini", test: /Opera Mini/i, version: [/Opera Mini\/(\d+(?:\.\d+)?)/i] },
  { name: "Edge", test: /Edg(?:e|A|iOS)?\//i, version: [/Edg(?:e|A|iOS)?\/(\d+(?:\.\d+)?)/i] },
  { name: "Vivaldi", test: /Vivaldi/i, version: [/Vivaldi\/(\d+(?:\.\d+)?)/i] },
  { name: "Brave", test: /\bBrave\//i, version: [/Brave\/(\d+(?:\.\d+)?)/i] },
  { name: "DuckDuckGo", test: /DuckDuckGo/i, version: [/DuckDuckGo\/(\d+(?:\.\d+)?)/i] },
  { name: "Ecosia", test: /Ecosia/i, version: [/Ecosia\/(\d+(?:\.\d+)?)/i] },
  { name: "QQ Browser", test: /MQQBrowser|QQBrowser/i, version: [/(?:MQQBrowser|QQBrowser)\/(\d+(?:\.\d+)?)/i] },
  { name: "MIUI Browser", test: /MiuiBrowser|XiaoMi/i, version: [/MiuiBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "Huawei Browser", test: /HuaweiBrowser/i, version: [/HuaweiBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "Coc Coc", test: /coc_coc_browser/i, version: [/coc_coc_browser\/(\d+(?:\.\d+)?)/i] },
  { name: "Sogou", test: /SogouMobileBrowser|SE /i, version: [/SogouMobileBrowser\/(\d+(?:\.\d+)?)/i] },
  { name: "Pale Moon", test: /PaleMoon/i, version: [/PaleMoon\/(\d+(?:\.\d+)?)/i] },
  { name: "Waterfox", test: /Waterfox/i, version: [/Waterfox\/(\d+(?:\.\d+)?)/i] },
  { name: "SeaMonkey", test: /SeaMonkey/i, version: [/SeaMonkey\/(\d+(?:\.\d+)?)/i] },
  { name: "Silk", test: /\bSilk\//i, version: [/Silk\/(\d+(?:\.\d+)?)/i] },
  { name: "Puffin", test: /Puffin/i, version: [/Puffin\/(\d+(?:\.\d+)?)/i] },
  { name: "Firefox", test: /FxiOS|Firefox/i, version: [/FxiOS\/(\d+(?:\.\d+)?)/i, /Firefox\/(\d+(?:\.\d+)?)/i] },
  { name: "Chrome", test: /CriOS|Chrome\//i, version: [/CriOS\/(\d+(?:\.\d+)?)/i, /Chrome\/(\d+(?:\.\d+)?)/i] },
  { name: "Chromium", test: /Chromium\//i, version: [/Chromium\/(\d+(?:\.\d+)?)/i] },
  { name: "Android WebView", test: /\bwv\)|; wv\)/i, version: [/Chrome\/(\d+(?:\.\d+)?)/i] },
  { name: "Safari", test: /Safari\//i, version: [/Version\/(\d+(?:\.\d+)?)/i] },
  { name: "Internet Explorer", test: /MSIE |Trident\//i, version: [/MSIE (\d+(?:\.\d+)?)/i, /rv:(\d+(?:\.\d+)?)/i] },
];

function isSafariCandidate(ua: string): boolean {
  if (!/Safari\//i.test(ua)) return false;
  if (/Chrome|Chromium|CriOS|OPR|Edg|Android/i.test(ua)) return false;
  return /Version\//i.test(ua) || /iPhone|iPad|Macintosh/i.test(ua);
}

export function parseUserAgent(raw: string | null | undefined): ParsedUserAgent | null {
  const ua = raw?.trim();
  if (!ua) return null;

  const osInfo = detectOs(ua);
  let browser: string | null = null;
  let browserVersion: string | null = null;

  for (const rule of BROWSER_RULES) {
    if (!rule.test.test(ua)) continue;
    if (rule.name === "Safari" && !isSafariCandidate(ua)) continue;
    if (rule.name === "Chrome" && /Edg(?:e|A|iOS)?\/|OPR\/|YaBrowser|SamsungBrowser|UCBrowser|Vivaldi|Brave\//i.test(ua)) {
      continue;
    }
    browser = rule.name;
    for (const re of rule.version) {
      const v = match(ua, re);
      if (v) {
        browserVersion = majorMinor(v);
        break;
      }
    }
    break;
  }

  if (!browser) return null;

  return {
    browser,
    browserVersion,
    os: osInfo?.os ?? null,
    osVersion: osInfo?.osVersion ?? null,
  };
}

/** Short label, or the original UA when parsing fails. */
export function formatUserAgent(raw: string | null | undefined): string {
  const ua = raw?.trim();
  if (!ua) return "—";
  const parsed = parseUserAgent(ua);
  if (!parsed) return ua;

  const browser = parsed.browserVersion
    ? `${parsed.browser} ${parsed.browserVersion}`
    : parsed.browser;
  if (!parsed.os) return browser;
  const os = parsed.osVersion ? `${parsed.os} ${parsed.osVersion}` : parsed.os;
  return `${browser} · ${os}`;
}

export function groupByParsedUserAgent(
  items: { label: string; value: number }[],
): Array<{ label: string; value: number; percent: number; title?: string }> {
  const map = new Map<string, { value: number; raw: string }>();
  for (const item of items) {
    const label = formatUserAgent(item.label);
    const cur = map.get(label);
    if (cur) cur.value += item.value;
    else map.set(label, { value: item.value, raw: item.label });
  }
  const total = [...map.values()].reduce((s, x) => s + x.value, 0) || 1;
  return [...map.entries()]
    .sort((a, b) => b[1].value - a[1].value)
    .map(([label, x]) => ({
      label,
      value: x.value,
      percent: Math.round((x.value / total) * 100),
      title: x.raw,
    }));
}
