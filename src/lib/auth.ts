// FILE: src/lib/auth.ts
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface UserPayload {
  sub: string;
  email: string;
  tenantId: string;
  role: string;
  iat: number;
  exp: number;
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<UserPayload>(token);
    
    if (decoded.exp * 1000 < Date.now()) {
      // Token has expired
      return null;
    }

    return {
      isLoggedIn: true,
      userId: decoded.sub,
      email: decoded.email,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
