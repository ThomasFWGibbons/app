// FILE: src/lib/api-client.ts
import createClient from "openapi-fetch";
import type { paths } from "./api-schema";

const apiClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
});

// Interceptor to add auth token from browser cookies
apiClient.use({
    async onRequest(req) {
        if (typeof window !== "undefined") {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];
            
            if (token) {
                req.headers.set("Authorization", `Bearer ${token}`);
            }
        }
        return req;
    }
});

export default apiClient;
