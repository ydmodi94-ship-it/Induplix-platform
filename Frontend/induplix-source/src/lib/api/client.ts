/**
 * Minimal API client. Uses VITE_API_BASE_URL to communicate with the Node.js backend.
 */
export const API_BASE_URL: string | undefined = import.meta.env["VITE_API_BASE_URL"] || undefined;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Network error. Please check your connection and try again.");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(data.message || `Request failed (${res.status}).`, res.status, data.errors);
  }

  return data as T;
}
