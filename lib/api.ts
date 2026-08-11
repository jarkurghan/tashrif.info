import { env } from "@/lib/env";

export function getApiBase() {
  return env.apiUrl.replace(/\/$/, "");
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${getApiBase()}${path}`, {
    ...rest,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}
