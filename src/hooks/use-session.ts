// FILE: src/hooks/use-session.ts
"use client";

import { AuthContext } from "@/components/auth-provider";
import { useContext } from "react";

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
}
