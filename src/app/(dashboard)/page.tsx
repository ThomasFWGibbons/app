// FILE: src/app/(dashboard)/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Hello, {session.email}! Here you can manage your business.
      </p>
    </div>
  );
}
