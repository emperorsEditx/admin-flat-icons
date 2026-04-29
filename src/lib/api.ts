const DEFAULT_API_BASE_URL = "https://cloudflare-workers-openapi-production.up.railway.app";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_NEST_API_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalizedPath}`;
};

export const proxyApiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `/api/proxy/${normalizedPath}`;
};