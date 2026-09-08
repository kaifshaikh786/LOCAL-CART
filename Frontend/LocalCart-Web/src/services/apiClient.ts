/**
 * Centralized API Client for LocalCart ASP.NET Core Web API
 */

export class ApiError extends Error {
  public statusCode: number;
  public errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = sessionStorage.getItem("localcart-auth-token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      let validationErrors: string[] = [];
      if (data && typeof data === "object" && data.errors) {
        if (Array.isArray(data.errors)) {
          validationErrors = data.errors.map(String);
        } else if (typeof data.errors === "object") {
          for (const key of Object.keys(data.errors)) {
            const val = data.errors[key];
            if (Array.isArray(val)) {
              validationErrors.push(...val.map(String));
            } else if (val) {
              validationErrors.push(String(val));
            }
          }
        }
      }

      const errorMessage =
        (validationErrors.length > 0 && validationErrors.join(" ")) ||
        (data &&
          typeof data === "object" &&
          (data.message || data.title || data.error)) ||
        (typeof data === "string" && data) ||
        `Request failed with status ${response.status}`;

      throw new ApiError(
        errorMessage,
        response.status,
        validationErrors.length > 0 ? validationErrors : undefined,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network / offline error
    throw new ApiError(
      (error as Error).message || "Unable to connect to LocalCart server.",
      0,
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: "PUT",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  del: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "DELETE", headers }),
};
