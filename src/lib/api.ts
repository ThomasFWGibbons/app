// FILE: src/lib/api.ts
import { cookies } from "next/headers";
import createClient from "openapi-fetch";
import type { paths } from "./api-schema";

/**
 * Creates a server-side API client.
 * This is intended to be used in Server Components, Route Handlers, and Server Actions.
 * It automatically includes the auth token from cookies.
 */
export function createServerApiClient() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
    headers,
  });
}
