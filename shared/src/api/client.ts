import createClient from "openapi-fetch";
import type { paths } from "./schema";

/**
 * Type-safe API client generated from OpenAPI schema
 * 
 * Usage:
 *   const { data, error } = await apiClient.GET("/users/{id}", {
 *     params: { path: { id: "123" } }
 *   });
 * 
 *   const { data, error } = await apiClient.POST("/users", {
 *     body: { name: "John", email: "john@example.com" }
 *   });
 */
export const apiClient = createClient<paths>({
  baseUrl: import.meta.env?.VITE_API_BASE_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Configure authentication token
 */
export function setAuthToken(token: string) {
  apiClient.use({
    onRequest({ request }) {
      request.headers.set("Authorization", `Bearer ${token}`);
      return request;
    },
  });
}

/**
 * Configure custom headers
 */
export function setHeaders(headers: Record<string, string>) {
  apiClient.use({
    onRequest({ request }) {
      Object.entries(headers).forEach(([key, value]) => {
        request.headers.set(key, value);
      });
      return request;
    },
  });
}