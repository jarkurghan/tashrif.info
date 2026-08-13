import { env } from "@/lib/env";

export function getApiBase() {
  return env.apiUrl.replace(/\/$/, "");
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
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
    let message = text || `API ${res.status}`;
    let code: string | undefined;
    try {
      const json = JSON.parse(text) as { error?: string; code?: string };
      if (json.error) message = json.error;
      code = json.code;
    } catch {
      /* not json */
    }
    throw new ApiError(message, res.status, code);
  }
  return res.json() as Promise<T>;
}
