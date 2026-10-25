// src/services/apiClient.ts

import type { ErrorResponseDto } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: string;

  constructor(
    status: number,
    errorCode: string,
    message: string
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
  );

  // PUT/DELETE metodai dažnai grąžina 204
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");

  const data =
    contentType?.includes("application/json")
      ? await response.json()
      : null;

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

export const apiClient = {
  get<T>(endpoint: string) {
    return request<T>(endpoint);
  },

  post<TResponse, TRequest>(
    endpoint: string,
    body: TRequest
  ) {
    return request<TResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<TResponse = void, TRequest = unknown>(
    endpoint: string,
    body?: TRequest
  ) {
    return request<TResponse>(endpoint, {
      method: "PUT",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  delete<TResponse = void>(endpoint: string) {
    return request<TResponse>(endpoint, {
      method: "DELETE",
    });
  },
};