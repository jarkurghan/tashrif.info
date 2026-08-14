/**
 * Central env access.
 * - Server secrets: set at container runtime
 * - NEXT_PUBLIC_*: set as Docker build-args (inlined at build)
 */
export const env = {
  apiUrl:
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.tashrif.info",
};
