// Central API utility for fetching the backend URL from environment
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function apiUrl(path: string) {
  // Ensure no double slashes
  return `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
}
