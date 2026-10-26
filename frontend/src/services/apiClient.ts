import type { ErrorResponseDto } from "../types/api";

// Base URL of the backend API, read from the Vite environment variables.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Error thrown when the API responds with a non-successful status code.
 * Carries the HTTP status and the backend error code for error handling in the UI.
 */
export class ApiError extends Error {
  // HTTP status code of the response.
  readonly status: number;
  // Error code returned by the backend, or "UNKNOWN_ERROR" if none was provided.
  readonly errorCode: string;

  constructor(status: number, errorCode: string, message: string) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

/**
 * Sends an HTTP request to the API and returns the parsed JSON response.
 * Throws an ApiError if the response status is not successful.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Send the request as JSON by default, allowing callers to add or override headers.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // PUT/DELETE methods often return 204 with no content to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse the body only if the response is JSON.
  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  // Convert error responses to ApiError, falling back to the HTTP status info.
  if (!response.ok) {
    const error = data as ErrorResponseDto | null;

    throw new ApiError(
      error?.status ?? response.status,
      error?.errorCode ?? "UNKNOWN_ERROR",
      error?.message ?? response.statusText
    );
  }

  return data as T;
}

/**
 * Typed helper methods for calling the API using the common request function.
 */
export const apiClient = {
  // Send a GET request to the given endpoint.
  get<T>(endpoint: string) {
    return request<T>(endpoint);
  },

  // Send a POST request with the body serialized as JSON.
  post<TResponse, TRequest>(endpoint: string, body: TRequest) {
    return request<TResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Send a PUT request, with an optional JSON body.
  put<TResponse = void, TRequest = unknown>(endpoint: string, body?: TRequest) {
    return request<TResponse>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  // Send a DELETE request to the given endpoint.
  delete<TResponse = void>(endpoint: string) {
    return request<TResponse>(endpoint, {
      method: "DELETE",
    });
  },
};